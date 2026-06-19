import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-manage-certificates',
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
          <a routerLink="/admin/applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> Applications</a>
          <a routerLink="/admin/certificates" class="nav-item active"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/admin/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header"><div><h1 class="page-title">Certificate Requests</h1><p class="page-subtitle">Approve or reject volunteer certificate requests</p></div></div>

        <div class="filter-bar">
          <select class="form-select filter-select" [(ngModel)]="filterStatus" (change)="load()">
            <option value="">All Statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>
        </div>

        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>

        <div class="table-card" *ngIf="!loading">
          <div class="table-responsive">
            <table class="table np-table">
              <thead>
                <tr><th>#</th><th>Volunteer</th><th>Certificate Type</th><th>Reason</th><th>Requested</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let cert of certificates; let i=index">
                  <td class="text-muted">{{i+1}}</td>
                  <td>
                    <div class="vol-cell">
                      <div class="vol-av">{{cert.volunteer?.name?.charAt(0)}}</div>
                      <div><div class="fw-600">{{cert.volunteer?.name}}</div><div class="text-muted small">{{cert.volunteer?.email}}</div></div>
                    </div>
                  </td>
                  <td><span class="cert-type-badge">{{cert.certificateType}}</span></td>
                  <td class="text-muted small reason-cell">{{cert.reason | slice:0:80}}{{cert.reason?.length > 80 ? '...' : ''}}</td>
                  <td class="text-muted small">{{cert.requestedDate | date:'mediumDate'}}</td>
                  <td><span class="status-badge status-{{cert.status.toLowerCase()}}">{{cert.status}}</span></td>
                  <td>
                    <div class="action-btns" *ngIf="cert.status==='Pending'">
                      <button class="btn-approve" (click)="openApprove(cert)"><i class="bi bi-check-lg"></i> Approve</button>
                      <button class="btn-reject" (click)="reject(cert)"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <span *ngIf="cert.status!=='Pending'" class="text-muted small">—</span>
                  </td>
                </tr>
                <tr *ngIf="certificates.length===0">
                  <td colspan="7" class="text-center text-muted py-4">No certificate requests found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <!-- Approve Modal -->
    <div class="modal-overlay" *ngIf="approveModal" (click)="approveModal=null">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header-np"><h5>Approve Certificate</h5><button class="modal-close" (click)="approveModal=null"><i class="bi bi-x-lg"></i></button></div>
        <div class="modal-body-np">
          <p class="text-muted">Approving certificate for <strong>{{approveModal?.volunteer?.name}}</strong>: {{approveModal?.certificateType}}</p>
          <div class="mb-3">
            <label class="form-label">Certificate URL (optional)</label>
            <input type="url" class="form-control np-input" [(ngModel)]="certUrl" placeholder="https://link-to-certificate.pdf">
          </div>
          <div class="mb-4">
            <label class="form-label">Admin Note (optional)</label>
            <textarea class="form-control np-input" rows="2" [(ngModel)]="adminNote" placeholder="Any message for the volunteer..."></textarea>
          </div>
          <div class="modal-footer-actions">
            <button class="btn-cancel" (click)="approveModal=null">Cancel</button>
            <button class="btn-approve-submit" (click)="submitApprove()" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>✓ Approve
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
    .filter-bar{margin-bottom:20px}
    .filter-select{border-radius:10px;border:1.5px solid #e0e0e0;max-width:200px}
    .loading-state{text-align:center;padding:80px 0}
    .table-card{background:white;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.05);overflow:hidden}
    .np-table{margin:0}.np-table th{background:#f8fcfa;color:#444;font-weight:600;font-size:0.85rem;border-bottom:2px solid #e8f5ee;padding:12px 16px;white-space:nowrap}
    .np-table td{padding:14px 16px;vertical-align:middle;border-bottom:1px solid #f8f8f8;font-size:0.9rem}
    .np-table tbody tr:hover{background:#fafff9}
    .vol-cell{display:flex;align-items:center;gap:10px}
    .vol-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0}
    .fw-600{font-weight:600}
    .cert-type-badge{background:rgba(142,45,226,0.08);color:#6a1b9a;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:600}
    .reason-cell{max-width:200px}
    .status-badge{padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:600;white-space:nowrap}
    .status-pending{background:#fff3e0;color:#e65100}.status-approved{background:#e8f5ee;color:#1a6b4a}.status-rejected{background:#fde8e8;color:#c62828}
    .action-btns{display:flex;gap:6px}
    .btn-approve{background:rgba(26,107,74,0.1);color:#1a6b4a;border:1px solid rgba(26,107,74,0.2);border-radius:8px;padding:5px 12px;font-size:0.82rem;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:4px}
    .btn-approve:hover{background:#1a6b4a;color:white}
    .btn-reject{background:rgba(220,53,69,0.1);color:#dc3545;border:1px solid rgba(220,53,69,0.2);border-radius:8px;padding:5px 10px;font-size:0.82rem;cursor:pointer;transition:all 0.2s}
    .btn-reject:hover{background:#dc3545;color:white}
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
    .btn-approve-submit{background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;border:none;border-radius:10px;padding:10px 24px;font-weight:600;cursor:pointer}
    .btn-approve-submit:disabled{opacity:0.7;cursor:not-allowed}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class ManageCertificatesComponent implements OnInit {
  certificates: any[] = [];
  loading = false; saving = false; filterStatus = '';
  approveModal: any = null; certUrl = ''; adminNote = '';

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAllCertificates({ status: this.filterStatus }).subscribe({
      next:(r)=>{ this.certificates=r.certificates||[]; this.loading=false; },
      error:()=>this.loading=false
    });
  }

  openApprove(cert: any) { this.approveModal=cert; this.certUrl=''; this.adminNote=''; }

  submitApprove() {
    this.saving=true;
    this.api.approveCertificate(this.approveModal._id, { adminNote: this.adminNote, certificateUrl: this.certUrl }).subscribe({
      next:()=>{ this.toast.success('Certificate approved!'); this.approveModal=null; this.saving=false; this.load(); },
      error:(e)=>{ this.toast.error(e.error?.message||'Error'); this.saving=false; }
    });
  }

  reject(cert: any) {
    const note = prompt('Reason for rejection (optional):') || '';
    this.api.rejectCertificate(cert._id, { adminNote: note }).subscribe({
      next:()=>{ this.toast.success('Certificate rejected'); this.load(); },
      error:()=>this.toast.error('Failed to reject')
    });
  }
}
