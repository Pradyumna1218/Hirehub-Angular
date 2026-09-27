import { Component, OnInit, signal, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  editingJobId = signal<number | null>(null);

  private platformId = inject(PLATFORM_ID);

  constructor(
    private jobService: JobService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories);

        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
          const id = Number(idParam);
          this.editingJobId.set(id);
          this.loadExistingJob(id);
        } else if (categories.length > 0) {
          this.formData.categoryId = categories[0].id;
        }
      }
    });
  }

  loadExistingJob(id: number): void {
    this.jobService.getById(id).subscribe({
      next: (job) => {
        this.formData.title = job.title;
        this.formData.description = job.description;
        this.formData.budget = job.budget;
        this.formData.deadline = job.deadline.substring(0, 10);
        this.formData.categoryId = this.categories().find(c => c.name === job.categoryName)?.id ?? 0;

        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage.set('Could not load this job for editing.');
      }
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    const editingId = this.editingJobId();

    const request$ = editingId
      ? this.jobService.update(editingId, this.formData)
      : this.jobService.create(this.formData);

    request$.subscribe({
      next: (job) => {
        this.isLoading.set(false);
        this.router.navigate(['/jobs', job.id]);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to save job.');
      }
    });
  }
}