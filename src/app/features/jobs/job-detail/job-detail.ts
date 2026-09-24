import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job';
import { ProposalService } from '../../../core/services/proposal';
import { AuthService } from '../../../core/services/auth';
import { JobResponse } from '../../../core/models/job.models';
import { ProposalCreateRequest } from '../../../core/models/proposal.models';

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

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private proposalService: ProposalService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
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
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      }
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
}