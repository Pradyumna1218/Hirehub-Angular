import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { JobService } from '../../../core/services/job';
import { CategoryService } from '../../../core/services/category';
import { JobResponse } from '../../../core/models/job.models';
import { CategoryResponse } from '../../../core/models/category.models';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './job-list.html',
  styleUrl: './job-list.scss'
})
export class JobList implements OnInit {
  jobs = signal<JobResponse[]>([]);
  categories = signal<CategoryResponse[]>([]);
  isLoading = signal(true);

  searchTerm = '';
  selectedCategoryId: number | null = null;

  private platformId = inject(PLATFORM_ID);

  constructor(
    private jobService: JobService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip data fetching during server-side render
    }

    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories.set(categories)
    });

    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading.set(true);
    this.jobService.getList({
      search: this.searchTerm,
      categoryId: this.selectedCategoryId ?? undefined,
      pageNumber: 1,
      pageSize: 20
    }).subscribe({
      next: (result) => {
        this.jobs.set(result.items);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(): void {
    this.loadJobs();
  }

  onCategoryChange(): void {
    this.loadJobs();
  }
}