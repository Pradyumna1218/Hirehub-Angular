import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  formData: LoginRequest = { email: '', password: '' };

  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.authService.login(this.formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message ?? 'Invalid email or password.');
      }
    });
  }
}