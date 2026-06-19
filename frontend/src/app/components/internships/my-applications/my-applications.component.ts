import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Volunteer Portal</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/volunteer/dashboard" class="nav-item"><i class="bi bi-house-fill"></i> Dashboard</a>
          <a routerLink="/volunteer/profile" class="nav-item"><i class="bi bi-person-fill"></i> My Profile</a>
          <a routerLink="/volunteer/internships" class="nav-item"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/volunteer/my-applications" class="nav-item active"><i class="bi bi-file-earmark-text-fill"></i> My Applications</a>
          <a routerLink="/volunteer/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/volunteer/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header"><h1 class="page-title">My Applications</h1><p class="page-subtitle">Track your internship applications</p></div>
        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>
        <div *ngIf="!loading">
          <div *ngIf="applications.length === 0" class="empty-page">
            <div class="empty-icon">📋</div>
            <h4>No Applications Yet</h4>
            <p class="text-muted">You haven't applied for any internships.</p>
            <a routerLink="/volunteer/internships" class="btn-primary-np">Browse Internships</a>
          </div>
          <div class="apps-list" *ngIf="applications.length > 0">
            <div *ngFor="let app of applications" class="app-card">
              <div class="app-card-left">
                <div class="app-icon">{{getCategoryIcon(app.internship?.category)}}</div>
                <div class="app-info">
                  <h5 class="app-title">{{app.internship?.title || 'Internship'}}</h5>
                  <div class="app-meta">
                    <span><i class="bi bi-tag me-1"></i>{{app.internship?.category}}</span>
                    <span><i class="bi bi-clock me-1"></i>{{app.internship?.duration}}</span>
                    <span><i class="bi bi-calendar me-1"></i>Applied {{app.appliedDate | date:'mediumDate'}}</span>
                  </div>
                </div>
              </div>
              <div class="app-card-right">
                <span class="status-badge status-{{app.status.toLowerCase()}}">
                  <i class="bi" [ngClass]="getStatusIcon(app.status)"></i> {{app.status}}
                </span>
                <div *ngIf="app.adminNote" class="admin-note">
                  <i class="bi bi-info-circle me-1"></i>{{app.adminNote}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout{display:flex;min-height:100vh;background:#f4f7f4}
    .sidebar{width:260px;background:linear-gradient(180deg,#0f2417,#1a6b4a);color:white;display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;overflow-y:auto}
    .sidebar-brand{display:flex;align-items:center;gap:12px;padding:24px 20px;border-bottom:1px solid rgba(255,255,255,0.1)}
    .brand-icon{font-size:2rem}.brand-name{font-weight:700;font-size:1.1rem}.brand-role{font-size:0.75rem;opacity:0.6}
    .sidebar-nav{flex:1;padding:16px 12px}
    .nav-item{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.9rem;font-weight:500;margin-bottom:4px;transition:all 0.2s}
    .nav-item:hover,.nav-item.active{background:rgba(255,255,255,0.15);color:white}
    .sidebar-footer{padding:16px 12px;border-top:1px solid rgba(255,255,255,0.1)}
    .btn-logout{width:100%;background:rgba(255,0,0,0.1);color:rgba(255,255,255,0.7);border:1px solid rgba(255,0,0,0.2);border-radius:10px;padding:10px;font-size:0.9rem;cursor:pointer}
    .main-content{margin-left:260px;padding:32px;flex:1}
    .content-header{margin-bottom:24px}.page-title{font-size:1.8rem;font-weight:800;color:#1a1a1a;margin:0}.page-subtitle{color:#888;margin:4px 0 0}
    .loading-state{text-align:center;padding:80px 0}
    .empty-page{text-align:center;padding:80px 20px}.empty-icon{font-size:4rem;margin-bottom:16px}
    .empty-page h4{font-weight:700;color:#333}.empty-page p{margin-bottom:20px}
    .btn-primary-np{background:#1a6b4a;color:white;padding:10px 24px;border-radius:10px;text-decoration:none;font-weight:600}
    .apps-list{display:flex;flex-direction:column;gap:16px}
    .app-card{background:white;border-radius:16px;padding:20px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:space-between;gap:16px;transition:all 0.2s}
    .app-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1);transform:translateY(-1px)}
    .app-card-left{display:flex;align-items:center;gap:16px;flex:1}
    .app-icon{font-size:2.5rem;background:#f8fcfa;width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .app-title{font-size:1.05rem;font-weight:700;color:#1a1a1a;margin:0 0 6px}
    .app-meta{display:flex;gap:16px;flex-wrap:wrap}
    .app-meta span{color:#888;font-size:0.82rem;display:flex;align-items:center}
    .app-card-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
    .status-badge{padding:6px 16px;border-radius:20px;font-size:0.85rem;font-weight:600;white-space:nowrap;display:flex;align-items:center;gap:6px}
    .status-pending{background:#fff3e0;color:#e65100}
    .status-shortlisted{background:#e3f2fd;color:#1565c0}
    .status-selected{background:#e8f5ee;color:#1a6b4a}
    .status-rejected{background:#fde8e8;color:#c62828}
    .admin-note{background:#f8f9fa;border-radius:8px;padding:6px 12px;font-size:0.82rem;color:#666;max-width:260px;text-align:right}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}.app-card{flex-direction:column;align-items:flex-start}.app-card-right{align-items:flex-start}}
  `]
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];
  loading = true;
  constructor(public authService: AuthService, private api: ApiService) {}
  ngOnInit() {
    this.api.getMyApplications().subscribe({
      next: (r) => { this.applications = r.applications || []; this.loading = false; },
      error: () => this.loading = false
    });
  }
  getCategoryIcon(cat: string): string {
    const m: any = {'Front End Development':'🎨','Full Stack Development':'⚡','Backend Development':'🔧','Artificial Intelligence':'🤖','Data Analytics':'📊'};
    return m[cat] || '💼';
  }
  getStatusIcon(s: string): string {
    const m: any = {Pending:'bi-clock',Shortlisted:'bi-eye',Selected:'bi-check-circle-fill',Rejected:'bi-x-circle-fill'};
    return m[s] || 'bi-circle';
  }
}
