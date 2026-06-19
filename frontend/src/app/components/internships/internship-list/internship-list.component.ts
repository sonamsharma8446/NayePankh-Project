import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-internship-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Volunteer Portal</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/volunteer/dashboard" class="nav-item"><i class="bi bi-house-fill"></i> Dashboard</a>
          <a routerLink="/volunteer/profile" class="nav-item"><i class="bi bi-person-fill"></i> My Profile</a>
          <a routerLink="/volunteer/internships" class="nav-item active"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/volunteer/my-applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> My Applications</a>
          <a routerLink="/volunteer/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/volunteer/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header"><h1 class="page-title">Internship Opportunities</h1><p class="page-subtitle">Find and apply for internships</p></div>

        <div class="filter-bar">
          <div class="search-box">
            <i class="bi bi-search search-icon"></i>
            <input type="text" class="form-control search-input" placeholder="Search internships..." [(ngModel)]="searchTerm" (input)="filterInternships()">
          </div>
          <select class="form-select filter-select" [(ngModel)]="selectedCategory" (change)="filterInternships()">
            <option value="">All Categories</option>
            <option *ngFor="let c of categories" [value]="c">{{c}}</option>
          </select>
        </div>

        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>

        <div class="internships-grid" *ngIf="!loading">
          <div *ngFor="let int of filtered" class="int-card">
            <div class="int-card-header">
              <div class="int-category-icon">{{getCategoryIcon(int.category)}}</div>
              <div class="int-category-badge">{{int.category}}</div>
            </div>
            <h5 class="int-title">{{int.title}}</h5>
            <p class="int-desc">{{int.description | slice:0:120}}...</p>
            <div class="int-meta">
              <span class="meta-item"><i class="bi bi-clock me-1"></i>{{int.duration}}</span>
              <span class="meta-item"><i class="bi bi-currency-rupee me-1"></i>{{int.stipend}}</span>
              <span class="meta-item"><i class="bi bi-people me-1"></i>{{int.openings}} openings</span>
            </div>
            <div class="int-skills">
              <span *ngFor="let s of int.skills?.slice(0,4)" class="skill-chip">{{s}}</span>
            </div>
            <div class="int-footer">
              <span *ngIf="int.deadline" class="deadline">
                <i class="bi bi-calendar2-x me-1 text-danger"></i>
                Deadline: {{int.deadline | date:'mediumDate'}}
              </span>
              <button class="btn-apply"
                [disabled]="appliedIds.includes(int._id) || applying === int._id"
                (click)="openApply(int)">
                <span *ngIf="applying === int._id" class="spinner-border spinner-border-sm me-1"></span>
                {{appliedIds.includes(int._id) ? '✓ Applied' : 'Apply Now'}}
              </button>
            </div>
          </div>
          <div *ngIf="filtered.length === 0" class="empty-grid">
            <i class="bi bi-briefcase"></i>
            <h5>No internships found</h5>
            <p class="text-muted">Try changing your filters</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Apply Modal -->
    <div class="modal-overlay" *ngIf="applyModal" (click)="applyModal=null">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header-np">
          <h5>Apply for {{applyModal?.title}}</h5>
          <button class="modal-close" (click)="applyModal=null"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body-np">
          <div class="mb-3">
            <label class="form-label fw-600">Cover Letter</label>
            <textarea class="form-control np-input" rows="4" [(ngModel)]="coverLetter"
              placeholder="Tell us why you want this internship and what you bring..."></textarea>
          </div>
          <div class="mb-4">
            <label class="form-label fw-600">Resume/Portfolio Link (optional)</label>
            <input type="url" class="form-control np-input" [(ngModel)]="resumeLink" placeholder="https://your-resume-link.com">
          </div>
          <button class="btn-save w-100" (click)="submitApply()" [disabled]="applying">
            <span *ngIf="applying" class="spinner-border spinner-border-sm me-2"></span>
            Submit Application
          </button>
        </div>
      </div>
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
    .content-header{margin-bottom:24px}.page-title{font-size:1.8rem;font-weight:800;color:#1a1a1a;margin:0}.page-subtitle{color:#888;margin:4px 0 0}
    .filter-bar{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
    .search-box{position:relative;flex:1;min-width:200px}
    .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#aaa}
    .search-input{padding-left:36px;border-radius:10px;border:1.5px solid #e0e0e0}
    .search-input:focus{border-color:#1a6b4a;box-shadow:0 0 0 3px rgba(26,107,74,0.1)}
    .filter-select{border-radius:10px;border:1.5px solid #e0e0e0;max-width:240px}
    .loading-state{text-align:center;padding:80px 0}
    .internships-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
    .int-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);transition:all 0.3s;display:flex;flex-direction:column;gap:12px}
    .int-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(26,107,74,0.12);border:1px solid rgba(26,107,74,0.15)}
    .int-card-header{display:flex;align-items:center;justify-content:space-between}
    .int-category-icon{font-size:2rem}
    .int-category-badge{background:rgba(26,107,74,0.08);color:#1a6b4a;padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:600}
    .int-title{font-size:1.1rem;font-weight:700;color:#1a1a1a;margin:0}
    .int-desc{color:#666;font-size:0.9rem;line-height:1.6;margin:0}
    .int-meta{display:flex;gap:12px;flex-wrap:wrap}
    .meta-item{color:#888;font-size:0.82rem;display:flex;align-items:center}
    .int-skills{display:flex;gap:6px;flex-wrap:wrap}
    .skill-chip{background:#f0f0f0;color:#555;padding:3px 10px;border-radius:20px;font-size:0.75rem}
    .int-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto}
    .deadline{font-size:0.8rem;color:#666}
    .btn-apply{background:#1a6b4a;color:white;border:none;border-radius:10px;padding:8px 20px;font-weight:600;font-size:0.9rem;cursor:pointer;transition:all 0.2s;white-space:nowrap}
    .btn-apply:hover:not(:disabled){background:#155a3d;transform:translateY(-1px)}
    .btn-apply:disabled{background:#aaa;cursor:not-allowed;transform:none}
    .empty-grid{grid-column:1/-1;text-align:center;padding:80px 0;color:#aaa}
    .empty-grid i{font-size:3rem;display:block;margin-bottom:12px}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-card{background:white;border-radius:20px;width:100%;max-width:520px;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    .modal-header-np{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header-np h5{font-weight:700;margin:0}.modal-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#666;padding:4px 8px;border-radius:8px}
    .modal-body-np{padding:24px}
    .form-label{font-size:0.9rem;font-weight:600;color:#444;margin-bottom:6px}.fw-600{font-weight:600}
    .np-input{border-radius:10px;border:1.5px solid #e0e0e0;padding:10px 14px;font-size:0.95rem;transition:all 0.2s}
    .np-input:focus{border-color:#1a6b4a;box-shadow:0 0 0 3px rgba(26,107,74,0.1);outline:none}
    .btn-save{background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;border:none;border-radius:10px;padding:12px 32px;font-weight:600;cursor:pointer;transition:all 0.2s}
    .btn-save:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(26,107,74,0.3)}
    .btn-save:disabled{opacity:0.7;cursor:not-allowed}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}.internships-grid{grid-template-columns:1fr}}
  `]
})
export class InternshipListComponent implements OnInit {
  internships: any[] = [];
  filtered: any[] = [];
  appliedIds: string[] = [];
  loading = false;
  applying: any = null;
  applyModal: any = null;
  coverLetter = '';
  resumeLink = '';
  searchTerm = '';
  selectedCategory = '';
  categories = ['Front End Development', 'Full Stack Development', 'Backend Development', 'Artificial Intelligence', 'Data Analytics'];

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.loading = true;
    this.api.getAllInternships({ isActive: true }).subscribe({
      next: (r) => { this.internships = r.internships || []; this.filtered = [...this.internships]; this.loading = false; },
      error: () => this.loading = false
    });
    this.api.getMyApplications().subscribe({
      next: (r) => this.appliedIds = (r.applications || []).map((a: any) => a.internship?._id || a.internship),
      error: () => {}
    });
  }

  filterInternships() {
    this.filtered = this.internships.filter(i => {
      const matchSearch = !this.searchTerm || i.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCat = !this.selectedCategory || i.category === this.selectedCategory;
      return matchSearch && matchCat;
    });
  }

  getCategoryIcon(cat: string): string {
    const icons: any = { 'Front End Development': '🎨', 'Full Stack Development': '⚡', 'Backend Development': '🔧', 'Artificial Intelligence': '🤖', 'Data Analytics': '📊' };
    return icons[cat] || '💼';
  }

  openApply(int: any) { this.applyModal = int; this.coverLetter = ''; this.resumeLink = ''; }

  submitApply() {
    if (!this.applyModal) return;
    this.applying = this.applyModal._id;
    this.api.applyInternship({ internshipId: this.applyModal._id, coverLetter: this.coverLetter, resumeLink: this.resumeLink }).subscribe({
      next: () => {
        this.toast.success('Application submitted successfully!');
        this.appliedIds.push(this.applyModal._id);
        this.applyModal = null;
        this.applying = null;
      },
      error: (e) => { this.toast.error(e.error?.message || 'Application failed'); this.applying = null; }
    });
  }
}
