import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/dashboard/baby-dashboard').then(m => m.BabyDashboardComponent),
      },
      {
        path: 'log',
        loadComponent: () =>
          import('./features/log/log-page').then(m => m.LogPageComponent),
      },
      {
        path: 'timeline',
        loadComponent: () =>
          import('./features/timeline/timeline').then(m => m.TimelineComponent),
      },
      {
        path: 'charts',
        loadComponent: () =>
          import('./features/charts/charts-page').then(m => m.ChartsPageComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings-page').then(m => m.SettingsPageComponent),
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
    ],
  },
];
