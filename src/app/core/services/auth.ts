import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

const ACCESS_TOKEN_KEY = 'hirehub_access_token';
const REFRESH_TOKEN_KEY = 'hirehub_refresh_token';
const USER_KEY = 'hirehub_user';

interface StoredUser {
  email: string;
  fullName: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private currentUserSignal = signal<StoredUser | null>(this.loadUserFromStorage());

  currentUser = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor(private http: HttpClient, private router: Router) {}

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(tap(response => this.storeAuth(response)));
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap(response => this.storeAuth(response)));
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(tap(response => this.storeAuth(response)));
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/logout`, { refreshToken }).subscribe();
    }
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private storeAuth(response: AuthResponse): void {
    if (!this.isBrowser) return;

    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

    const user: StoredUser = {
      email: response.email,
      fullName: response.fullName,
      role: response.role
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private clearAuth(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
  }

  private loadUserFromStorage(): StoredUser | null {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return null;

    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}