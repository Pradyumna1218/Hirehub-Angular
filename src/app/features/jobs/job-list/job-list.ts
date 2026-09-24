import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/job';
import { JobResponse } from '../../../core/models/job.models';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './job-list.html',
  styleUrl: './job-list.scss'
})
export class JobList implements OnInit {
  jobs = signal<JobResponse[]>([]);
  isLoading = signal(true);
  searchTerm = '';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading.set(true);
    this.jobService.getList({ search: this.searchTerm, pageNumber: 1, pageSize: 20 }).subscribe({
      next: (result) => {
        this.jobs.set(result.items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSearch(): void {
    this.loadJobs();
  }
}