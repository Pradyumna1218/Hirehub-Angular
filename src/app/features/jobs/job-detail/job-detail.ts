import { Component, OnInit, signal, inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  imports: [DatePipe, FormsModule],
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

  jobProposals = signal<ProposalResponse[]>([]);
  isOwner = signal(false);
  actionError = signal<string | null>(null);

  private platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private proposalService: ProposalService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
     if (!isPlatformBrowser(this.platformId)) {
      return;
    }
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
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      }
    });
  }

  loadProposals(jobId: number): void {
    this.proposalService.getForJob(jobId).subscribe({
      next: (proposals) => this.jobProposals.set(proposals),
      error: () => {} // If it fails (e.g. not the owner), simply show nothing
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
      next: () => {
        this.isSubmittingProposal.set(false);
        this.proposalSubmitted.set(true);
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
}