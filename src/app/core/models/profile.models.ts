export interface FreelancerProfileResponse {
  id: number;
  fullName: string;
  bio: string | null;
  hourlyRate: number | null;
  location: string | null;
  portfolioUrl: string | null;
  email: string;
}

export interface FreelancerProfileUpdateRequest {
  fullName: string;
  bio: string | null;
  hourlyRate: number | null;
  location: string | null;
  portfolioUrl: string | null;
}

export interface ClientProfileResponse {
  id: number;
  fullName: string;
  companyName: string | null;
  email: string;
}

export interface ClientProfileUpdateRequest {
  fullName: string;
  companyName: string | null;
}

export interface PublicFreelancerProfileResponse {
  id: number;
  fullName: string;
  bio: string | null;
  hourlyRate: number | null;
  location: string | null;
  portfolioUrl: string | null;
  averageRating: number;
  reviewCount: number;
}