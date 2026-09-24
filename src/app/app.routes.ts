import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { JobList } from './features/jobs/job-list/job-list';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'jobs', component: JobList },
  { path: '', redirectTo: '/jobs', pathMatch: 'full' }
];