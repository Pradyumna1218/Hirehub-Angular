import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { JobList } from './features/jobs/job-list/job-list';
import { JobDetail } from './features/jobs/job-detail/job-detail';
import { JobCreate } from './features/jobs/job-create/job-create';
import { MyJobs } from './features/jobs/my-jobs/my-jobs';
import { MyProposals } from './features/proposals/my-proposals/my-proposals';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'jobs', component: JobList },
  { path: 'jobs/new', component: JobCreate, canActivate: [authGuard, roleGuard('Client')] },
  { path: 'my-jobs', component: MyJobs, canActivate: [authGuard, roleGuard('Client')] },
  { path: 'my-proposals', component: MyProposals, canActivate: [authGuard, roleGuard('Freelancer')] },
  { path: 'jobs/:id', component: JobDetail },
  { path: '', redirectTo: '/jobs', pathMatch: 'full' }
];