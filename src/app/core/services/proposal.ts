import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProposalResponse, ProposalCreateRequest } from '../models/proposal.models';

@Injectable({ providedIn: 'root' })
export class ProposalService {
  constructor(private http: HttpClient) {}

  create(request: ProposalCreateRequest): Observable<ProposalResponse> {
    return this.http.post<ProposalResponse>(`${environment.apiUrl}/proposals`, request);
  }

  getMine(): Observable<ProposalResponse[]> {
    return this.http.get<ProposalResponse[]>(`${environment.apiUrl}/proposals/mine`);
  }

  getForJob(jobId: number): Observable<ProposalResponse[]> {
    return this.http.get<ProposalResponse[]>(`${environment.apiUrl}/proposals/job/${jobId}`);
  }

  accept(proposalId: number): Observable<ProposalResponse> {
    return this.http.post<ProposalResponse>(`${environment.apiUrl}/proposals/${proposalId}/accept`, {});
  }

  reject(proposalId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/proposals/${proposalId}/reject`, {});
  }
}