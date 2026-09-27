import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile';
import { AuthService } from '../../../core/services/auth';
import { FreelancerProfileResponse, ClientProfileResponse } from '../../../core/models/profile.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  isFreelancer = signal(false);
  isLoading = signal(true);
  isSaving = signal(false);
  saveSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  freelancerData = { fullName: '', bio: '' as string | null, hourlyRate: null as number | null, location: '' as string | null, portfolioUrl: '' as string | null };
  clientData = { fullName: '', companyName: '' as string | null };
  email = '';

  private platformId = inject(PLATFORM_ID);

  constructor(private profileService: ProfileService, public authService: AuthService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const role = this.authService.currentUser()?.role;
    this.isFreelancer.set(role === 'Freelancer');

    if (this.isFreelancer()) {
      this.profileService.getMyFreelancerProfile().subscribe({
        next: (p) => {
          this.freelancerData = { fullName: p.fullName, bio: p.bio, hourlyRate: p.hourlyRate, location: p.location, portfolioUrl: p.portfolioUrl };
          this.email = p.email;
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    } else {
      this.profileService.getMyClientProfile().subscribe({
        next: (p) => {
          this.clientData = { fullName: p.fullName, companyName: p.companyName };
          this.email = p.email;
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  save(): void {
    this.isSaving.set(true);
    this.saveSuccess.set(false);
    this.errorMessage.set(null);

    const request$: Observable<FreelancerProfileResponse | ClientProfileResponse> = this.isFreelancer()
      ? this.profileService.updateMyFreelancerProfile(this.freelancerData)
      : this.profileService.updateMyClientProfile(this.clientData);

    request$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
      },
      error: (err: any) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message ?? 'Failed to update profile.');
      }
    });
  }
}