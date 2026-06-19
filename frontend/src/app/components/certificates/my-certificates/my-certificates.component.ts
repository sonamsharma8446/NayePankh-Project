import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-my-certificates',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Volunteer Portal</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/volunteer/dashboard" class="nav-item"><i class="bi bi-house-fill"></i> Dashboard</a>
          <a routerLink="/volunteer/profile" class="nav-item"><i class="bi bi-person-fill"></i> My Profile</a>
          <a routerLink="/volunteer/internships" class="nav-item"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/volunteer/my-applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> My Applications</a>
          <a routerLink="/volunteer/certificates" class="nav-item active"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/volunteer/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header">
          <div><h1 class="page-title">My Certificates</h1><p class="page-subtitle">Request and track your certificates</p></div>
          <button class="btn-add" (click)="showForm=true"><i class="bi bi-plus-lg me-2"></i>Request Certificate</button>
        </div>

        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>

        <div *ngIf="!loading">
          <div *ngIf="certificates.length===0" class="empty-page">
            <div class="empty-icon">🏆</div>
            <h4>No Certificate Requests</h4>
            <p class="text-muted">Request a certificate for your volunteer work.</p>
            <button class="btn-primary-np" (click)="showForm=true">Request Now</button>
          </div>
          <div class="certs-grid" *ngIf="certificates.length>0">
            <div *ngFor="let cert of certificates" class="cert-card">
              <div class="cert-card-header">
                <div class="cert-badge-icon">🏆</div>
                <span class="status-badge status-{{cert.status.toLowerCase()}}">{{cert.status}}</span>
              </div>
              <h5 class="cert-type">{{cert.certificateType}}</h5>
              <p class="cert-reason text-muted small">{{cert.reason}}</p>
              <div class="cert-meta">
                <span><i class="bi bi-calendar me-1"></i>Requested: {{cert.requestedDate | date:'mediumDate'}}</span>
                <span *ngIf="cert.resolvedDate"><i class="bi bi-check-circle me-1 text-success"></i>Resolved: {{cert.resolvedDate | date:'mediumDate'}}</span>
              </div>
              <div *ngIf="cert.adminNote" class="admin-note-box">
                <i class="bi bi-chat-square-text me-2"></i>{{cert.adminNote}}
              </div>
              <a *ngIf="cert.status==='Approved' && cert.certificateUrl" [href]="cert.certificateUrl" target="_blank" class="btn-download">
                <i class="bi bi-download me-2"></i>Download Certificate
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Request Form Modal -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header-np"><h5>Request Certificate</h5><button class="modal-close" (click)="showForm=false"><i class="bi bi-x-lg"></i></button></div>
        <div class="modal-body-np">
          <div class="mb-3">
            <label class="form-label">Certificate Type *</label>
            <select class="form-select np-input" [(ngModel)]="form.certificateType">
              <option>Volunteer Certificate</option>
              <option>Internship Completion</option>
              <option>Achievement Award</option>
              <option>Appreciation Letter</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="form-label">Reason / Description *</label>
            <textarea class="form-control np-input" rows="4" [(ngModel)]="form.reason" placeholder="Describe your contribution and why you need this certificate..."></textarea>
          </div>
          <div class="modal-footer-actions">
            <button class="btn-cancel" (click)="showForm=false">Cancel</button>
            <button class="btn-save" (click)="submitRequest()" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>Submit Request
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
    .main-content{margin-left:260px;padding:32px;flex:1}
    .content-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
    .page-title{font-size:1.8rem;font-weight:800;color:#1a1a1a;margin:0}.page-subtitle{color:#888;margin:4px 0 0}
    .btn-add{background:#1a6b4a;color:white;border:none;border-radius:10px;padding:10px 20px;font-weight:600;cursor:pointer;display:flex;align-items:center}
    .loading-state{text-align:center;padding:80px 0}
    .empty-page{text-align:center;padding:80px 20px}.empty-icon{font-size:4rem;margin-bottom:16px}
    .empty-page h4{font-weight:700;color:#333;margin-bottom:8px}.btn-primary-np{background:#1a6b4a;color:white;padding:10px 24px;border-radius:10px;border:none;font-weight:600;cursor:pointer;margin-top:12px}
    .certs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
    .cert-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);display:flex;flex-direction:column;gap:10px;transition:all 0.2s}
    .cert-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1)}
    .cert-card-header{display:flex;justify-content:space-between;align-items:center}
    .cert-badge-icon{font-size:2.5rem}
    .cert-type{font-weight:700;color:#1a1a1a;margin:0;font-size:1rem}
    .cert-reason{margin:0;line-height:1.6}
    .cert-meta{display:flex;flex-direction:column;gap:4px}
    .cert-meta span{color:#888;font-size:0.82rem;display:flex;align-items:center}
    .admin-note-box{background:#f8f9fa;border-left:3px solid #1a6b4a;border-radius:0 8px 8px 0;padding:10px 12px;font-size:0.85rem;color:#555}
    .btn-download{background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;border:none;border-radius:10px;padding:10px 20px;font-weight:600;text-decoration:none;display:flex;align-items:center;justify-content:center;margin-top:4px;transition:all 0.2s}
    .btn-download:hover{background:#155a3d;color:white}
    .status-badge{padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:600}
    .status-pending{background:#fff3e0;color:#e65100}.status-approved{background:#e8f5ee;color:#1a6b4a}.status-rejected{background:#fde8e8;color:#c62828}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-card{background:white;border-radius:20px;width:100%;max-width:480px;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    .modal-header-np{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header-np h5{font-weight:700;margin:0}.modal-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#666;padding:4px 8px;border-radius:8px}
    .modal-body-np{padding:24px}
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
export class MyCertificatesComponent implements OnInit {
  certificates: any[] = [];
  loading = true; saving = false; showForm = false;
  form = { certificateType: 'Volunteer Certificate', reason: '' };

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}
  ngOnInit() {
    this.api.getMyCertificates().subscribe({
      next:(r)=>{ this.certificates=r.certificates||[]; this.loading=false; },
      error:()=>this.loading=false
    });
  }

  submitRequest() {
    if (!this.form.reason.trim()) { this.toast.warning('Please provide a reason'); return; }
    this.saving = true;
    this.api.requestCertificate(this.form).subscribe({
      next:(r)=>{ this.certificates.unshift(r.certificate); this.showForm=false; this.saving=false; this.toast.success('Certificate request submitted!'); this.form={certificateType:'Volunteer Certificate',reason:''}; },
      error:(e)=>{ this.toast.error(e.error?.message||'Request failed'); this.saving=false; }
    });
  }
}
