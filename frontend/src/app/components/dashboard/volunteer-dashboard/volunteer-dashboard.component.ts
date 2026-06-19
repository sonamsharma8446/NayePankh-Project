import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Volunteer Portal</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/volunteer/dashboard" class="nav-item active"><i class="bi bi-house-fill"></i> Dashboard</a>
          <a routerLink="/volunteer/profile" class="nav-item"><i class="bi bi-person-fill"></i> My Profile</a>
          <a routerLink="/volunteer/internships" class="nav-item"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/volunteer/my-applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> My Applications</a>
          <a routerLink="/volunteer/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/volunteer/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer">
          <button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      </aside>
      <main class="main-content">
        <div class="content-header">
          <div><h1 class="page-title">My Dashboard</h1><p class="page-subtitle">Welcome, {{authService.currentUser?.name}} 🌱</p></div>
        </div>
        <div class="vol-stats-grid">
          <div class="vol-stat-card">
            <div class="vsc-icon" style="background:linear-gradient(135deg,#1a6b4a,#2d9d6e)"><i class="bi bi-file-earmark-text-fill"></i></div>
            <div class="vsc-num">{{myApplications.length}}</div><div class="vsc-label">Applications</div>
          </div>
          <div class="vol-stat-card">
            <div class="vsc-icon" style="background:linear-gradient(135deg,#2193b0,#6dd5ed)"><i class="bi bi-award-fill"></i></div>
            <div class="vsc-num">{{myCertificates.length}}</div><div class="vsc-label">Certificates</div>
          </div>
          <div class="vol-stat-card">
            <div class="vsc-icon" style="background:linear-gradient(135deg,#f7971e,#ffd200)"><i class="bi bi-megaphone-fill"></i></div>
            <div class="vsc-num">{{announcements.length}}</div><div class="vsc-label">Announcements</div>
          </div>
          <div class="vol-stat-card">
            <div class="vsc-icon" style="background:linear-gradient(135deg,#8e2de2,#4a00e0)"><i class="bi bi-briefcase-fill"></i></div>
            <div class="vsc-num">{{openInternships}}</div><div class="vsc-label">Open Internships</div>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-4">
            <div class="profile-card">
              <div class="profile-avatar">{{authService.currentUser?.name?.charAt(0)}}</div>
              <h5 class="profile-name">{{authService.currentUser?.name}}</h5>
              <p class="profile-email">{{authService.currentUser?.email}}</p>
              <div class="profile-badges"><span class="badge-volunteer">🌱 Volunteer</span></div>
              <div class="profile-detail" *ngIf="volunteerProfile">
                <div class="pd-row"><i class="bi bi-geo-alt"></i><span>{{volunteerProfile.city}}</span></div>
                <div class="pd-row"><i class="bi bi-mortarboard"></i><span>{{volunteerProfile.education}}</span></div>
                <div class="pd-row"><i class="bi bi-clock"></i><span>{{volunteerProfile.availability}}</span></div>
              </div>
              <div class="skills-section" *ngIf="volunteerProfile?.skills?.length">
                <p class="skills-label">Skills</p>
                <div class="skills-tags"><span *ngFor="let s of volunteerProfile.skills" class="skill-tag">{{s}}</span></div>
              </div>
              <div *ngIf="volunteerProfile?.recommendedRole" class="recommendation-box">
                <div class="rec-label">🤖 AI Recommended Role</div>
                <div class="rec-role">{{volunteerProfile.recommendedRole}}</div>
              </div>
              <a routerLink="/volunteer/profile" class="btn-edit-profile">
                <i class="bi bi-pencil-fill me-2"></i>{{volunteerProfile ? 'Edit Profile' : 'Complete Profile'}}
              </a>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="dash-card mb-4">
              <div class="dash-card-header"><h5>Recent Applications</h5><a routerLink="/volunteer/my-applications" class="view-all">View All</a></div>
              <div *ngIf="myApplications.length === 0" class="empty-state"><i class="bi bi-file-earmark-x"></i><p>No applications yet. <a routerLink="/volunteer/internships">Browse internships</a></p></div>
              <div *ngFor="let app of myApplications.slice(0,3)" class="app-item">
                <div class="app-info"><div class="app-title">{{app.internship?.title || 'Internship'}}</div><div class="text-muted small">{{app.internship?.category}}</div></div>
                <span class="status-badge status-{{app.status.toLowerCase()}}">{{app.status}}</span>
              </div>
            </div>
            <div class="dash-card mb-4">
              <div class="dash-card-header"><h5>Latest Announcements</h5><a routerLink="/volunteer/announcements" class="view-all">View All</a></div>
              <div *ngIf="announcements.length === 0" class="empty-state"><i class="bi bi-megaphone"></i><p>No announcements.</p></div>
              <div *ngFor="let ann of announcements.slice(0,3)" class="ann-item">
                <span class="ann-type-badge ann-{{ann.type.toLowerCase()}}">{{ann.type}}</span>
                <div class="ann-content flex-1"><div class="ann-title">{{ann.title}}</div><div class="text-muted small">{{ann.createdAt | date:'mediumDate'}}</div></div>
                <span class="priority-{{ann.priority.toLowerCase()}}">{{ann.priority}}</span>
              </div>
            </div>
            <div class="dash-card">
              <div class="dash-card-header"><h5>My Certificates</h5><a routerLink="/volunteer/certificates" class="view-all">Manage</a></div>
              <div *ngIf="myCertificates.length === 0" class="empty-state"><i class="bi bi-award"></i><p>No certificate requests. <a routerLink="/volunteer/certificates">Request one</a></p></div>
              <div *ngFor="let cert of myCertificates.slice(0,3)" class="cert-item">
                <i class="bi bi-award-fill cert-icon"></i>
                <div class="cert-info flex-1"><div class="cert-type">{{cert.certificateType}}</div><div class="text-muted small">{{cert.requestedDate | date:'mediumDate'}}</div></div>
                <span class="status-badge status-{{cert.status.toLowerCase()}}">{{cert.status}}</span>
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
    .main-content{margin-left:260px;padding:32px;flex:1;min-width:0}
    .content-header{margin-bottom:28px}
    .page-title{font-size:1.8rem;font-weight:800;color:#1a1a1a;margin:0}
    .page-subtitle{color:#888;margin:4px 0 0}
    .vol-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
    .vol-stat-card{background:white;border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.05);transition:transform 0.2s}
    .vol-stat-card:hover{transform:translateY(-2px)}
    .vsc-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:white;margin:0 auto 12px}
    .vsc-num{font-size:2rem;font-weight:800;color:#1a1a1a}.vsc-label{font-size:0.8rem;color:#888}
    .profile-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);text-align:center}
    .profile-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;margin:0 auto 16px}
    .profile-name{font-weight:700;font-size:1.2rem;margin-bottom:4px}.profile-email{color:#888;font-size:0.85rem;margin-bottom:12px}
    .profile-badges{display:flex;gap:8px;justify-content:center;margin-bottom:16px}
    .badge-volunteer{background:rgba(26,107,74,0.1);color:#1a6b4a;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:600}
    .profile-detail{background:#f8fcfa;border-radius:12px;padding:12px 16px;margin-bottom:16px;text-align:left}
    .pd-row{display:flex;align-items:center;gap:10px;padding:4px 0;font-size:0.9rem;color:#555}.pd-row i{color:#1a6b4a;width:16px}
    .skills-section{margin-bottom:16px;text-align:left}
    .skills-label{font-size:0.8rem;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px}
    .skills-tags{display:flex;flex-wrap:wrap;gap:6px}
    .skill-tag{background:rgba(26,107,74,0.08);color:#1a6b4a;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:500}
    .recommendation-box{background:rgba(26,107,74,0.05);border:1px solid rgba(26,107,74,0.15);border-radius:12px;padding:12px 16px;margin-bottom:16px;text-align:left}
    .rec-label{font-size:0.78rem;color:#888;margin-bottom:4px}.rec-role{font-weight:700;color:#1a6b4a}
    .btn-edit-profile{background:#1a6b4a;color:white;border:none;border-radius:10px;padding:10px 20px;font-weight:600;width:100%;display:block;text-decoration:none;text-align:center;transition:all 0.2s}
    .btn-edit-profile:hover{background:#155a3d;color:white}
    .dash-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
    .dash-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
    .dash-card-header h5{font-weight:700;color:#1a1a1a;margin:0}.view-all{color:#1a6b4a;font-size:0.85rem;font-weight:600;text-decoration:none}
    .empty-state{text-align:center;padding:32px;color:#aaa}.empty-state i{font-size:2.5rem;display:block;margin-bottom:8px}.empty-state a{color:#1a6b4a;font-weight:600}
    .app-item,.ann-item,.cert-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f0f0f0}
    .app-item:last-child,.ann-item:last-child,.cert-item:last-child{border-bottom:none}
    .app-info,.ann-content,.cert-info{flex:1}
    .app-title,.ann-title,.cert-type{font-weight:600;color:#333;font-size:0.9rem}
    .ann-type-badge{padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:600;white-space:nowrap}
    .ann-general{background:#e8f5ee;color:#1a6b4a}.ann-internship{background:#fff3e0;color:#e65100}
    .ann-event{background:#e3f2fd;color:#1565c0}.ann-urgent{background:#fde8e8;color:#c62828}.ann-certificate{background:#f3e5f5;color:#6a1b9a}
    .priority-high{color:#c62828;font-size:0.75rem;font-weight:700}.priority-medium{color:#e65100;font-size:0.75rem;font-weight:700}.priority-low{color:#388e3c;font-size:0.75rem;font-weight:700}
    .cert-icon{font-size:1.5rem;color:#1a6b4a}
    .status-badge{padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:600;white-space:nowrap}
    .status-pending{background:#fff3e0;color:#e65100}.status-shortlisted{background:#e3f2fd;color:#1565c0}
    .status-selected,.status-approved{background:#e8f5ee;color:#1a6b4a}.status-rejected{background:#fde8e8;color:#c62828}
    @media(max-width:992px){.vol-stats-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class VolunteerDashboardComponent implements OnInit {
  myApplications: any[] = [];
  myCertificates: any[] = [];
  announcements: any[] = [];
  volunteerProfile: any = null;
  openInternships = 0;

  constructor(public authService: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getMyApplications().subscribe({ next: (r) => this.myApplications = r.applications || [], error: () => {} });
    this.api.getMyCertificates().subscribe({ next: (r) => this.myCertificates = r.certificates || [], error: () => {} });
    this.api.getAllAnnouncements().subscribe({ next: (r) => this.announcements = r.announcements || [], error: () => {} });
    this.api.getMyVolunteerProfile().subscribe({ next: (r) => this.volunteerProfile = r.volunteer, error: () => {} });
    this.api.getAllInternships({ isActive: true }).subscribe({ next: (r) => this.openInternships = r.internships?.length || 0, error: () => {} });
  }
}
