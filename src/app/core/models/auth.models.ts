export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'Client' | 'Freelancer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  email: string;
  fullName: string;
  role: string;
}