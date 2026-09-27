import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job';
import { ProposalService } from '../../../core/services/proposal';
import { AuthService } from '../../../core/services/auth';
import { JobResponse } from '../../../core/models/job.models';
import { ProposalCreateRequest, ProposalResponse } from '../../../core/models/proposal.models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './job-detail.html',
  styleUrl: './job-detail.scss'
})
export class JobDetail implements OnInit {
  job = signal<JobResponse | null>(null);
  isLoading = signal(true);
  notFound = signal(false);

  proposalData = { coverLetter: '', proposedPrice: 0, deliveryDays: 7 };
  proposalError = signal<string | null>(null);
  proposalSubmitted = signal(false);
  isSubmittingProposal = signal(false);
  myExistingProposal = signal<ProposalResponse | null>(null);

  jobProposals = signal<ProposalResponse[]>([]);
  isOwner = signal(false);
  actionError = signal<string | null>(null);

  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private proposalService: ProposalService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.notFound.set(true);
      this.isLoading.set(false);
      return;
    }

    this.jobService.getById(id).subscribe({
      next: (job) => {
        this.job.set(job);
        this.isLoading.set(false);

        const user = this.authService.currentUser();

        if (user && user.role === 'Client' && user.fullName === job.clientName) {
          this.isOwner.set(true);
          this.loadProposals(id);
        }

        if (user && user.role === 'Freelancer') {
          this.checkExistingProposal(id);
        }
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      }
    });
  }

  checkExistingProposal(jobId: number): void {
    this.proposalService.getMine().subscribe({
      next: (proposals) => {
        const existing = proposals.find(p => p.jobId === jobId);
        if (existing) this.myExistingProposal.set(existing);
      }
    });
  }

  loadProposals(jobId: number): void {
    this.proposalService.getForJob(jobId).subscribe({
      next: (proposals) => this.jobProposals.set(proposals),
      error: () => {}
    });
  }

  submitProposal(): void {
  const currentJob = this.job();
  if (!currentJob) return;

  this.proposalError.set(null);
  this.isSubmittingProposal.set(true);

  const request: ProposalCreateRequest = {
    jobId: currentJob.id,
    coverLetter: this.proposalData.coverLetter,
    proposedPrice: this.proposalData.proposedPrice,
    deliveryDays: this.proposalData.deliveryDays
  };

  this.proposalService.create(request).subscribe({
    next: (proposal) => {
      this.isSubmittingProposal.set(false);
      this.proposalSubmitted.set(true);
      this.myExistingProposal.set(proposal);

      // Refresh the job so its proposalCount updates without a page reload
      this.jobService.getById(currentJob.id).subscribe(job => this.job.set(job));
    },
    error: (err) => {
      this.isSubmittingProposal.set(false);
      this.proposalError.set(err.error?.message ?? 'Failed to submit proposal.');
    }
  });
}

  acceptProposal(proposalId: number): void {
    this.actionError.set(null);
    this.proposalService.accept(proposalId).subscribe({
      next: () => {
        const id = this.job()?.id;
        if (id) {
          this.jobService.getById(id).subscribe(job => this.job.set(job));
          this.loadProposals(id);
        }
      },
      error: (err) => this.actionError.set(err.error?.message ?? 'Failed to accept proposal.')
    });
  }

  rejectProposal(proposalId: number): void {
    this.actionError.set(null);
    this.proposalService.reject(proposalId).subscribe({
      next: () => {
        const id = this.job()?.id;
        if (id) this.loadProposals(id);
      },
      error: (err) => this.actionError.set(err.error?.message ?? 'Failed to reject proposal.')
    });
  }
  deleteJob(jobId: number): void {
    if (!confirm('Are you sure you want to delete this job? This cannot be undone.')) {
      return;
    }

    this.jobService.delete(jobId).subscribe({
      next: () => this.router.navigate(['/my-jobs']),
      error: (err) => this.actionError.set(err.error?.message ?? 'Failed to delete job.')
    });
}
}