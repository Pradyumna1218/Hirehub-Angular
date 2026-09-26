import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job';
import { JobResponse } from '../../../core/models/job.models';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-jobs.html',
  styleUrl: './my-jobs.scss'
})
export class MyJobs implements OnInit {
  jobs = signal<JobResponse[]>([]);
  isLoading = signal(true);
  private platformId = inject(PLATFORM_ID);

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.jobService.getMine().subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}