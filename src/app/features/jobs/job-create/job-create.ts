import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../core/services/job';
import { CategoryService } from '../../../core/services/category';
import { JobCreateRequest } from '../../../core/models/job.models';
import { CategoryResponse } from '../../../core/models/category.models';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './job-create.html',
  styleUrl: './job-create.scss'
})
export class JobCreate implements OnInit {
  formData: JobCreateRequest = {
    title: '',
    description: '',
    budget: 0,
    deadline: '',
    categoryId: 0
  };

  categories = signal<CategoryResponse[]>([]);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private jobService: JobService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        if (categories.length > 0) {
          this.formData.categoryId = categories[0].id;
        }
      }
    });
  }

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