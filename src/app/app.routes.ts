import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('angular-mfe-dashboard/Routes').then(m => m.routes)
  }
];
