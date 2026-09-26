import { Routes } from '@angular/router';
import { Home } from './features/home/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { JobList } from './features/jobs/job-list/job-list';
import { JobDetail } from './features/jobs/job-detail/job-detail';
import { JobCreate } from './features/jobs/job-create/job-create';
import { MyJobs } from './features/jobs/my-jobs/my-jobs';
import { MyProposals } from './features/proposals/my-proposals/my-proposals';
import { MyOrders } from './features/orders/my-orders/my-orders';
import { NotFound } from './features/not-found/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'jobs', component: JobList },
  { path: 'jobs/new', component: JobCreate, canActivate: [authGuard, roleGuard('Client')] },
  { path: 'my-jobs', component: MyJobs, canActivate: [authGuard, roleGuard('Client')] },
  { path: 'my-proposals', component: MyProposals, canActivate: [authGuard, roleGuard('Freelancer')] },
  { path: 'my-orders', component: MyOrders, canActivate: [authGuard] },
  { path: 'jobs/:id', component: JobDetail },
  { path: '**', component: NotFound }
];