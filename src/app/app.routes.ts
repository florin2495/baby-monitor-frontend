import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'babies', pathMatch: 'full' },
      {
        path: 'babies',
        loadComponent: () =>
          import('./features/babies/baby-list').then(m => m.BabyListComponent),
      },
      {
        path: 'babies/new',
        loadComponent: () =>
          import('./features/babies/baby-form').then(m => m.BabyFormComponent),
      },
      {
        path: 'babies/:id/edit',
        loadComponent: () =>
          import('./features/babies/baby-form').then(m => m.BabyFormComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'dashboard/:babyId',
        loadComponent: () =>
          import('./features/dashboard/baby-dashboard').then(m => m.BabyDashboardComponent),
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./features/timeline/timeline').then(m => m.TimelineComponent),
      },
    ],
  },
];
