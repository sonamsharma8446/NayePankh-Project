import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-announcements',
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
          <a routerLink="/volunteer/my-applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> My Applications</a>
          <a routerLink="/volunteer/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/volunteer/announcements" class="nav-item active"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header"><h1 class="page-title">Announcements</h1><p class="page-subtitle">Stay updated with latest news</p></div>
        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>
        <div *ngIf="!loading">
          <div *ngIf="announcements.length===0" class="empty-page"><div class="empty-icon">📢</div><h4>No Announcements</h4><p class="text-muted">Check back later for updates.</p></div>
          <div class="ann-list" *ngIf="announcements.length>0">
            <div *ngFor="let ann of announcements" class="ann-card" [class.urgent]="ann.priority==='High'">
              <div class="ann-card-header">
                <div class="ann-type-badge ann-{{ann.type.toLowerCase()}}">{{ann.type}}</div>
                <div class="ann-priority priority-{{ann.priority.toLowerCase()}}"><i class="bi bi-circle-fill me-1" style="font-size:0.5rem"></i>{{ann.priority}} Priority</div>
              </div>
              <h4 class="ann-title">{{ann.title}}</h4>
              <p class="ann-content">{{ann.content}}</p>
              <div class="ann-footer">
                <span class="ann-date"><i class="bi bi-calendar me-2"></i>{{ann.createdAt | date:'longDate'}}</span>
                <span *ngIf="ann.createdBy?.name" class="ann-by"><i class="bi bi-person me-1"></i>{{ann.createdBy.name}}</span>
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
    .empty-page{text-align:center;padding:80px 20px}.empty-icon{font-size:4rem;margin-bottom:16px}.empty-page h4{font-weight:700;color:#333}
    .ann-list{display:flex;flex-direction:column;gap:16px}
    .ann-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);border-left:4px solid transparent;transition:all 0.2s}
    .ann-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1)}
    .ann-card.urgent{border-left-color:#dc3545}
    .ann-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .ann-type-badge{padding:4px 14px;border-radius:20px;font-size:0.78rem;font-weight:600}
    .ann-general{background:#e8f5ee;color:#1a6b4a}.ann-internship{background:#fff3e0;color:#e65100}.ann-event{background:#e3f2fd;color:#1565c0}.ann-urgent{background:#fde8e8;color:#c62828}.ann-certificate{background:#f3e5f5;color:#6a1b9a}
    .ann-priority{font-size:0.78rem;font-weight:600;display:flex;align-items:center}
    .priority-high{color:#c62828}.priority-medium{color:#e65100}.priority-low{color:#388e3c}
    .ann-title{font-size:1.2rem;font-weight:700;color:#1a1a1a;margin:0 0 8px}
    .ann-content{color:#555;line-height:1.7;margin-bottom:16px}
    .ann-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f0f0f0;padding-top:12px}
    .ann-date,.ann-by{color:#aaa;font-size:0.82rem}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class AnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  loading = true;
  constructor(public authService: AuthService, private api: ApiService) {}
  ngOnInit() {
    this.api.getAllAnnouncements().subscribe({
      next:(r)=>{ this.announcements=r.announcements||[]; this.loading=false; },
      error:()=>this.loading=false
    });
  }
}
