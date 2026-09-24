import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobResponse, JobCreateRequest, JobListQuery, PagedResult } from '../models/job.models';

@Injectable({ providedIn: 'root' })
export class JobService {
  constructor(private http: HttpClient) {}

  getList(query: JobListQuery): Observable<PagedResult<JobResponse>> {
    let params = new HttpParams();

    if (query.search) params = params.set('search', query.search);
    if (query.categoryId) params = params.set('categoryId', query.categoryId);
    if (query.minBudget) params = params.set('minBudget', query.minBudget);
    if (query.maxBudget) params = params.set('maxBudget', query.maxBudget);
    if (query.status) params = params.set('status', query.status);
    params = params.set('pageNumber', query.pageNumber ?? 1);
    params = params.set('pageSize', query.pageSize ?? 10);

    return this.http.get<PagedResult<JobResponse>>(`${environment.apiUrl}/jobs`, { params });
  }

  getById(id: number): Observable<JobResponse> {
    return this.http.get<JobResponse>(`${environment.apiUrl}/jobs/${id}`);
  }

  getMine(): Observable<JobResponse[]> {
    return this.http.get<JobResponse[]>(`${environment.apiUrl}/jobs/mine`);
  }

  create(request: JobCreateRequest): Observable<JobResponse> {
    return this.http.post<JobResponse>(`${environment.apiUrl}/jobs`, request);
  }
}