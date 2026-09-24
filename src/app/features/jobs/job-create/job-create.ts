import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../core/services/job';
import { JobCreateRequest } from '../../../core/models/job.models';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './job-create.html',
  styleUrl: './job-create.scss'
})
export class JobCreate {
  formData: JobCreateRequest = {
    title: '',
    description: '',
    budget: 0,
    deadline: '',
    categoryId: 1
  };

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private jobService: JobService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.jobService.create(this.formData).subscribe({
      next: (job) => {
        this.isLoading.set(false);
        this.router.navigate(['/jobs', job.id]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to post job.');
      }
    });
  }
}