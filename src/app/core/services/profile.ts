import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  FreelancerProfileResponse, FreelancerProfileUpdateRequest,
  ClientProfileResponse, ClientProfileUpdateRequest,
  PublicFreelancerProfileResponse
} from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private http: HttpClient) {}

  getMyFreelancerProfile(): Observable<FreelancerProfileResponse> {
    return this.http.get<FreelancerProfileResponse>(`${environment.apiUrl}/profile/freelancer/me`);
  }

  updateMyFreelancerProfile(request: FreelancerProfileUpdateRequest): Observable<FreelancerProfileResponse> {
    return this.http.put<FreelancerProfileResponse>(`${environment.apiUrl}/profile/freelancer/me`, request);
  }

  getMyClientProfile(): Observable<ClientProfileResponse> {
    return this.http.get<ClientProfileResponse>(`${environment.apiUrl}/profile/client/me`);
  }

  updateMyClientProfile(request: ClientProfileUpdateRequest): Observable<ClientProfileResponse> {
    return this.http.put<ClientProfileResponse>(`${environment.apiUrl}/profile/client/me`, request);
  }
  getPublicFreelancerProfile(id: number): Observable<PublicFreelancerProfileResponse> {
    return this.http.get<PublicFreelancerProfileResponse>(`${environment.apiUrl}/profile/freelancer/${id}`);
  }

}