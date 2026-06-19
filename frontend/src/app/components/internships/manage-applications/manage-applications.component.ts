import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Admin Panel</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item"><i class="bi bi-speedometer2"></i> Dashboard</a>
          <a routerLink="/admin/volunteers" class="nav-item"><i class="bi bi-people-fill"></i> Volunteers</a>
          <a routerLink="/admin/internships" class="nav-item"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/admin/applications" class="nav-item active"><i class="bi bi-file-earmark-text-fill"></i> Applications</a>
          <a routerLink="/admin/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/admin/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header"><div><h1 class="page-title">Applications</h1><p class="page-subtitle">Review and manage internship applications</p></div></div>

        <div class="filter-bar">
          <select class="form-select filter-select" [(ngModel)]="filterStatus" (change)="load()">
            <option value="">All Statuses</option>
            <option>Pending</option><option>Shortlisted</option><option>Selected</option><option>Rejected</option>
          </select>
          <select class="form-select filter-select" [(ngModel)]="filterCategory" (change)="load()">
            <option value="">All Categories</option>
            <option *ngFor="let c of categories" [value]="c">{{c}}</option>
          </select>
          <div class="search-box">
            <i class="bi bi-search search-icon"></i>
            <input type="text" class="form-control search-input" placeholder="Search applicant..." [(ngModel)]="searchTerm" (input)="load()">
          </div>
        </div>

        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>

        <div class="table-card" *ngIf="!loading">
          <div class="table-responsive">
            <table class="table np-table">
              <thead>
                <tr><th>#</th><th>Applicant</th><th>Internship</th><th>Category</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let app of applications; let i=index">
                  <td class="text-muted">{{i+1}}</td>
                  <td>
                    <div class="applicant-cell">
                      <div class="app-avatar">{{app.applicant?.name?.charAt(0)}}</div>
                      <div><div class="fw-600">{{app.applicant?.name}}</div><div class="text-muted small">{{app.applicant?.email}}</div></div>
                    </div>
                  </td>
                  <td class="fw-600">{{app.internship?.title}}</td>
                  <td><span class="cat-badge">{{app.internship?.category}}</span></td>
                  <td class="text-muted small">{{app.appliedDate | date:'mediumDate'}}</td>
                  <td><span class="status-badge status-{{app.status.toLowerCase()}}">{{app.status}}</span></td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-action btn-view" (click)="viewApp(app)" title="View"><i class="bi bi-eye-fill"></i></button>
                      <button class="btn-action btn-update" (click)="openUpdate(app)" title="Update Status"><i class="bi bi-pencil-fill"></i></button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="applications.length===0">
                  <td colspan="7" class="text-center text-muted py-4">No applications found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- View Modal -->
    <div class="modal-overlay" *ngIf="viewModal" (click)="viewModal=null">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header-np"><h5>Application Details</h5><button class="modal-close" (click)="viewModal=null"><i class="bi bi-x-lg"></i></button></div>
        <div class="modal-body-np">
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Applicant</span><span class="detail-value">{{viewModal.applicant?.name}}</span></div>
            <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">{{viewModal.applicant?.email}}</span></div>
            <div class="detail-item"><span class="detail-label">Internship</span><span class="detail-value">{{viewModal.internship?.title}}</span></div>
            <div class="detail-item"><span class="detail-label">Category</span><span class="detail-value">{{viewModal.internship?.category}}</span></div>
            <div class="detail-item"><span class="detail-label">Status</span><span class="status-badge status-{{viewModal.status.toLowerCase()}}">{{viewModal.status}}</span></div>
            <div class="detail-item"><span class="detail-label">Applied On</span><span class="detail-value">{{viewModal.appliedDate | date:'long'}}</span></div>
            <div class="detail-item full-width" *ngIf="viewModal.coverLetter"><span class="detail-label">Cover Letter</span><p class="detail-value mt-1">{{viewModal.coverLetter}}</p></div>
            <div class="detail-item full-width" *ngIf="viewModal.resumeLink"><span class="detail-label">Resume Link</span><a [href]="viewModal.resumeLink" target="_blank" class="detail-value" style="color:#1a6b4a">{{viewModal.resumeLink}}</a></div>
            <div class="detail-item full-width" *ngIf="viewModal.adminNote"><span class="detail-label">Admin Note</span><p class="detail-value mt-1">{{viewModal.adminNote}}</p></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div class="modal-overlay" *ngIf="updateModal" (click)="updateModal=null">
      <div class="modal-card small" (click)="$event.stopPropagation()">
        <div class="modal-header-np"><h5>Update Status</h5><button class="modal-close" (click)="updateModal=null"><i class="bi bi-x-lg"></i></button></div>
        <div class="modal-body-np">
          <div class="mb-3">
            <label class="form-label">New Status</label>
            <select class="form-select np-input" [(ngModel)]="newStatus">
              <option>Pending</option><option>Shortlisted</option><option>Selected</option><option>Rejected</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="form-label">Admin Note (optional)</label>
            <textarea class="form-control np-input" rows="3" [(ngModel)]="adminNote" placeholder="Add a note for the applicant..."></textarea>
          </div>
          <div class="modal-footer-actions">
            <button class="btn-cancel" (click)="updateModal=null">Cancel</button>
            <button class="btn-save" (click)="submitUpdate()" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>Update
            </button>
          </div>
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
    .filter-bar{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}
    .filter-select{border-radius:10px;border:1.5px solid #e0e0e0;max-width:220px}
    .search-box{position:relative;flex:1;min-width:200px}
    .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#aaa}
    .search-input{padding-left:36px;border-radius:10px;border:1.5px solid #e0e0e0}
    .loading-state{text-align:center;padding:80px 0}
    .table-card{background:white;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.05);overflow:hidden}
    .np-table{margin:0}.np-table th{background:#f8fcfa;color:#444;font-weight:600;font-size:0.85rem;border-bottom:2px solid #e8f5ee;padding:12px 16px;white-space:nowrap}
    .np-table td{padding:14px 16px;vertical-align:middle;border-bottom:1px solid #f8f8f8;font-size:0.9rem}
    .np-table tbody tr:hover{background:#fafff9}
    .applicant-cell{display:flex;align-items:center;gap:10px}
    .app-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#2193b0,#6dd5ed);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0}
    .fw-600{font-weight:600}
    .cat-badge{background:rgba(26,107,74,0.08);color:#1a6b4a;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:600}
    .status-badge{padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:600;white-space:nowrap}
    .status-pending{background:#fff3e0;color:#e65100}.status-shortlisted{background:#e3f2fd;color:#1565c0}
    .status-selected{background:#e8f5ee;color:#1a6b4a}.status-rejected{background:#fde8e8;color:#c62828}
    .action-btns{display:flex;gap:6px}
    .btn-action{width:32px;height:32px;border-radius:8px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.85rem;transition:all 0.2s}
    .btn-view{background:rgba(26,107,74,0.1);color:#1a6b4a}.btn-view:hover{background:#1a6b4a;color:white}
    .btn-update{background:rgba(33,147,176,0.1);color:#2193b0}.btn-update:hover{background:#2193b0;color:white}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-card{background:white;border-radius:20px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    .modal-card.small{max-width:440px}
    .modal-header-np{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header-np h5{font-weight:700;margin:0}.modal-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#666;padding:4px 8px;border-radius:8px}
    .modal-body-np{padding:24px}
    .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .detail-item{background:#f8fcfa;border-radius:10px;padding:12px}.full-width{grid-column:1/-1}
    .detail-label{display:block;font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
    .detail-value{font-weight:600;color:#333}
    .form-label{font-size:0.9rem;font-weight:600;color:#444;margin-bottom:6px}
    .np-input{border-radius:10px;border:1.5px solid #e0e0e0;padding:10px 14px;font-size:0.95rem;transition:all 0.2s}
    .np-input:focus{border-color:#1a6b4a;box-shadow:0 0 0 3px rgba(26,107,74,0.1);outline:none}
    .modal-footer-actions{display:flex;gap:12px;justify-content:flex-end}
    .btn-cancel{background:#f0f0f0;color:#555;border:none;border-radius:10px;padding:10px 20px;font-weight:600;cursor:pointer}
    .btn-save{background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;border:none;border-radius:10px;padding:10px 24px;font-weight:600;cursor:pointer}
    .btn-save:disabled{opacity:0.7;cursor:not-allowed}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class ManageApplicationsComponent implements OnInit {
  applications: any[] = [];
  loading = false; saving = false;
  filterStatus = ''; filterCategory = ''; searchTerm = '';
  viewModal: any = null; updateModal: any = null;
  newStatus = 'Pending'; adminNote = '';
  categories = ['Front End Development','Full Stack Development','Backend Development','Artificial Intelligence','Data Analytics'];

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAllApplications({ status: this.filterStatus, category: this.filterCategory, search: this.searchTerm }).subscribe({
      next:(r)=>{ this.applications=r.applications||[]; this.loading=false; },
      error:()=>this.loading=false
    });
  }

  viewApp(app: any) { this.viewModal = app; }
  openUpdate(app: any) { this.updateModal = app; this.newStatus = app.status; this.adminNote = app.adminNote || ''; }

  submitUpdate() {
    if (!this.updateModal) return;
    this.saving = true;
    this.api.updateApplicationStatus(this.updateModal._id, { status: this.newStatus, adminNote: this.adminNote }).subscribe({
      next:()=>{ this.toast.success('Status updated!'); this.updateModal=null; this.saving=false; this.load(); },
      error:(e)=>{ this.toast.error(e.error?.message||'Error'); this.saving=false; }
    });
  }
}
