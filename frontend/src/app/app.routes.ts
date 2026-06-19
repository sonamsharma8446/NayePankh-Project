import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, GuestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) },
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    canActivate: [GuestGuard],
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Volunteer routes
  {
    path: 'volunteer',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/volunteer-dashboard/volunteer-dashboard.component').then(m => m.VolunteerDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/volunteers/volunteer-profile/volunteer-profile.component').then(m => m.VolunteerProfileComponent)
      },
      {
        path: 'internships',
        loadComponent: () => import('./components/internships/internship-list/internship-list.component').then(m => m.InternshipListComponent)
      },
      {
        path: 'my-applications',
        loadComponent: () => import('./components/internships/my-applications/my-applications.component').then(m => m.MyApplicationsComponent)
      },
      {
        path: 'certificates',
        loadComponent: () => import('./components/certificates/my-certificates/my-certificates.component').then(m => m.MyCertificatesComponent)
      },
      {
        path: 'announcements',
        loadComponent: () => import('./components/announcements/announcements.component').then(m => m.AnnouncementsComponent)
      }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'volunteers',
        loadComponent: () => import('./components/volunteers/volunteer-list/volunteer-list.component').then(m => m.VolunteerListComponent)
      },
      {
        path: 'internships',
        loadComponent: () => import('./components/internships/manage-internships/manage-internships.component').then(m => m.ManageInternshipsComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./components/internships/manage-applications/manage-applications.component').then(m => m.ManageApplicationsComponent)
      },
      {
        path: 'certificates',
        loadComponent: () => import('./components/certificates/manage-certificates/manage-certificates.component').then(m => m.ManageCertificatesComponent)
      },
      {
        path: 'announcements',
        loadComponent: () => import('./components/announcements/manage-announcements/manage-announcements.component').then(m => m.ManageAnnouncementsComponent)
      }
    ]
  },

  { path: 'unauthorized', loadComponent: () => import('./components/shared/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: '' }
];
