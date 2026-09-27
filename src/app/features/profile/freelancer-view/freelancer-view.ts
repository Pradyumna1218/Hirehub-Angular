import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../core/services/profile';
import { PublicFreelancerProfileResponse } from '../../../core/models/profile.models';

@Component({
  selector: 'app-freelancer-view',
  standalone: true,
  imports: [],
  templateUrl: './freelancer-view.html',
  styleUrl: './freelancer-view.scss'
})
export class FreelancerView implements OnInit {
  profile = signal<PublicFreelancerProfileResponse | null>(null);
  isLoading = signal(true);
  notFound = signal(false);

  private platformId = inject(PLATFORM_ID);

  constructor(private route: ActivatedRoute, private profileService: ProfileService) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.notFound.set(true);
      this.isLoading.set(false);
      return;
    }

    this.profileService.getPublicFreelancerProfile(id).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.isLoading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.isLoading.set(false);
      }
    });
  }
}