import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg np-navbar" [class.scrolled]="scrolled">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <span class="brand-icon">🌟</span>
          <span class="brand-text">NayePankh</span>
          <span class="brand-sub">Foundation</span>
        </a>

        <button class="navbar-toggler" type="button" (click)="toggleMenu()" [attr.aria-expanded]="menuOpen">
          <i class="bi" [class.bi-x-lg]="menuOpen" [class.bi-list]="!menuOpen"></i>
        </button>

        <div class="collapse navbar-collapse" [class.show]="menuOpen">
          <ul class="navbar-nav ms-auto align-items-center gap-1">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
            </li>

            <ng-container *ngIf="!authService.isLoggedIn">
              <li class="nav-item">
                <a class="nav-link" routerLink="/login">Login</a>
              </li>
              <li class="nav-item">
                <a class="btn btn-np-primary ms-2" routerLink="/register">Join Us</a>
              </li>
            </ng-container>

            <ng-container *ngIf="authService.isLoggedIn && authService.isVolunteer">
              <li class="nav-item">
                <a class="nav-link" routerLink="/volunteer/dashboard">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/volunteer/internships">Internships</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/volunteer/announcements">Announcements</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" (click)="toggleDropdown($event)">
                  <div class="nav-avatar">{{authService.currentUser?.name?.charAt(0)}}</div>
                  {{authService.currentUser?.name}}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" [class.show]="dropdownOpen">
                  <li><a class="dropdown-item" routerLink="/volunteer/profile"><i class="bi bi-person me-2"></i>Profile</a></li>
                  <li><a class="dropdown-item" routerLink="/volunteer/certificates"><i class="bi bi-award me-2"></i>My Certificates</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item text-danger" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </li>
            </ng-container>

            <ng-container *ngIf="authService.isLoggedIn && authService.isAdmin">
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/dashboard">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/volunteers">Volunteers</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/admin/applications">Applications</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" (click)="toggleDropdown($event)">
                  <div class="nav-avatar admin-avatar">A</div>
                  Admin
                </a>
                <ul class="dropdown-menu dropdown-menu-end" [class.show]="dropdownOpen">
                  <li><a class="dropdown-item" routerLink="/admin/internships"><i class="bi bi-briefcase me-2"></i>Internships</a></li>
                  <li><a class="dropdown-item" routerLink="/admin/certificates"><i class="bi bi-award me-2"></i>Certificates</a></li>
                  <li><a class="dropdown-item" routerLink="/admin/announcements"><i class="bi bi-megaphone me-2"></i>Announcements</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><button class="dropdown-item text-danger" (click)="logout()"><i class="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .np-navbar {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(26,107,74,0.1);
      padding: 12px 0;
      transition: all 0.3s ease;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .np-navbar.scrolled {
      box-shadow: 0 4px 20px rgba(26,107,74,0.12);
    }
    .brand-icon { font-size: 1.4rem; margin-right: 6px; }
    .brand-text { font-size: 1.25rem; font-weight: 800; color: #1a6b4a; letter-spacing: -0.5px; }
    .brand-sub { font-size: 0.75rem; color: #666; margin-left: 4px; font-weight: 400; }
    .nav-link { color: #444; font-weight: 500; padding: 8px 12px; border-radius: 8px; transition: all 0.2s; }
    .nav-link:hover, .nav-link.active { color: #1a6b4a; background: rgba(26,107,74,0.08); }
    .btn-np-primary { background: #1a6b4a; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; font-weight: 600; transition: all 0.2s; }
    .btn-np-primary:hover { background: #155a3d; color: #fff; transform: translateY(-1px); }
    .nav-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #1a6b4a, #2d9d6e); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; }
    .admin-avatar { background: linear-gradient(135deg, #e67e22, #f39c12); }
    .navbar-toggler { border: none; color: #1a6b4a; font-size: 1.4rem; }
    .navbar-toggler:focus { box-shadow: none; }
    .dropdown-menu { border: 1px solid rgba(26,107,74,0.15); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); padding: 8px; }
    .dropdown-item { border-radius: 8px; padding: 8px 12px; font-size: 0.9rem; }
    .dropdown-item:hover { background: rgba(26,107,74,0.08); color: #1a6b4a; }
  `]
})
export class NavbarComponent {
  menuOpen = false;
  dropdownOpen = false;
  scrolled = false;

  constructor(public authService: AuthService) {}

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 20; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    if (!(e.target as Element).closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  toggleDropdown(e: Event) { e.preventDefault(); this.dropdownOpen = !this.dropdownOpen; }
  logout() { this.authService.logout(); this.dropdownOpen = false; }
}
