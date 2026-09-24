export interface JobResponse {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  categoryName: string;
  clientName: string;
  proposalCount: number;
  createdAt: string;
}

export interface JobCreateRequest {
  title: string;
  description: string;
  budget: number;
  deadline: string;
  categoryId: number;
}

export interface JobListQuery {
  search?: string;
  categoryId?: number;
  minBudget?: number;
  maxBudget?: number;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}