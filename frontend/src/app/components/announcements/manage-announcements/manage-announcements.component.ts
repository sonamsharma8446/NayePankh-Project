import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-manage-announcements',
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
          <a routerLink="/admin/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/admin/announcements" class="nav-item active"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header">
          <div><h1 class="page-title">Announcements</h1><p class="page-subtitle">Create and manage announcements</p></div>
          <button class="btn-add" (click)="openForm()"><i class="bi bi-plus-lg me-2"></i>New Announcement</button>
        </div>
        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>
        <div class="ann-list" *ngIf="!loading">
          <div *ngFor="let ann of announcements" class="ann-admin-card">
            <div class="aac-header">
              <div class="ann-type-badge ann-{{ann.type.toLowerCase()}}">{{ann.type}}</div>
              <div class="aac-actions">
                <span class="priority-badge priority-{{ann.priority.toLowerCase()}}">{{ann.priority}}</span>
                <button class="btn-edit-sm" (click)="editForm(ann)"><i class="bi bi-pencil-fill"></i></button>
                <button class="btn-del-sm" (click)="deleteAnn(ann._id)"><i class="bi bi-trash-fill"></i></button>
              </div>
            </div>
            <h5 class="ann-title">{{ann.title}}</h5>
            <p class="ann-content text-muted">{{ann.content | slice:0:150}}{{ann.content?.length > 150 ? '...' : ''}}</p>
            <div class="ann-meta">
              <span class="text-muted small"><i class="bi bi-calendar me-1"></i>{{ann.createdAt | date:'mediumDate'}}</span>
              <span *ngIf="ann.sendEmail" class="email-sent-badge"><i class="bi bi-envelope-fill me-1"></i>Email Sent</span>
              <span class="active-badge" [class.inactive]="!ann.isActive">{{ann.isActive ? 'Active' : 'Hidden'}}</span>
            </div>
          </div>
          <div *ngIf="announcements.length===0" class="empty-state">
            <i class="bi bi-megaphone" style="font-size:3rem;color:#aaa;display:block;margin-bottom:12px"></i>
            <p class="text-muted">No announcements yet. Create one!</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Form Modal -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header-np"><h5>{{editingId ? 'Edit' : 'New'}} Announcement</h5><button class="modal-close" (click)="showForm=false"><i class="bi bi-x-lg"></i></button></div>
        <div class="modal-body-np">
          <div class="mb-3"><label class="form-label">Title *</label><input type="text" class="form-control np-input" [(ngModel)]="form.title"></div>
          <div class="mb-3"><label class="form-label">Content *</label><textarea class="form-control np-input" rows="4" [(ngModel)]="form.content"></textarea></div>
          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label">Type</label>
              <select class="form-select np-input" [(ngModel)]="form.type">
                <option>General</option><option>Internship</option><option>Event</option><option>Certificate</option><option>Urgent</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Priority</label>
              <select class="form-select np-input" [(ngModel)]="form.priority">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Expiry Date (optional)</label>
            <input type="date" class="form-control np-input" [(ngModel)]="form.expiryDate">
          </div>
          <div class="mb-4">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="sendEmail" [(ngModel)]="form.sendEmail">
              <label class="form-check-label" for="sendEmail"><i class="bi bi-envelope me-2"></i>Send email notification to all volunteers</label>
            </div>
          </div>
          <div class="modal-footer-actions">
            <button class="btn-cancel" (click)="showForm=false">Cancel</button>
            <button class="btn-save" (click)="save()" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>{{saving ? 'Saving...' : 'Publish'}}
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
    .btn-add{background:#1a6b4a;color:white;border:none;border-radius:10px;padding:10px 20px;font-weight:600;cursor:pointer;display:flex;align-items:center;transition:all 0.2s}
    .loading-state{text-align:center;padding:80px 0}
    .ann-list{display:flex;flex-direction:column;gap:16px}
    .ann-admin-card{background:white;border-radius:16px;padding:20px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);transition:all 0.2s}
    .ann-admin-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.08)}
    .aac-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
    .aac-actions{display:flex;align-items:center;gap:8px}
    .ann-type-badge{padding:4px 14px;border-radius:20px;font-size:0.78rem;font-weight:600}
    .ann-general{background:#e8f5ee;color:#1a6b4a}.ann-internship{background:#fff3e0;color:#e65100}.ann-event{background:#e3f2fd;color:#1565c0}.ann-urgent{background:#fde8e8;color:#c62828}.ann-certificate{background:#f3e5f5;color:#6a1b9a}
    .priority-badge{padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:600}
    .priority-high{background:#fde8e8;color:#c62828}.priority-medium{background:#fff3e0;color:#e65100}.priority-low{background:#e8f5ee;color:#1a6b4a}
    .btn-edit-sm,.btn-del-sm{width:30px;height:30px;border-radius:8px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.8rem;transition:all 0.2s}
    .btn-edit-sm{background:rgba(26,107,74,0.1);color:#1a6b4a}.btn-edit-sm:hover{background:#1a6b4a;color:white}
    .btn-del-sm{background:rgba(220,53,69,0.1);color:#dc3545}.btn-del-sm:hover{background:#dc3545;color:white}
    .ann-title{font-weight:700;color:#1a1a1a;margin-bottom:8px}
    .ann-content{margin-bottom:12px;line-height:1.6}
    .ann-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
    .email-sent-badge{background:#e3f2fd;color:#1565c0;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:600}
    .active-badge{background:#e8f5ee;color:#1a6b4a;padding:3px 10px;border-radius:20px;font-size:0.75rem;font-weight:600}
    .active-badge.inactive{background:#f0f0f0;color:#888}
    .empty-state{text-align:center;padding:60px;background:white;border-radius:16px}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-card{background:white;border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    .modal-header-np{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header-np h5{font-weight:700;margin:0}.modal-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#666;padding:4px 8px;border-radius:8px}
    .modal-body-np{padding:24px}
    .form-label{font-size:0.9rem;font-weight:600;color:#444;margin-bottom:6px}
    .np-input{border-radius:10px;border:1.5px solid #e0e0e0;padding:10px 14px;font-size:0.95rem;transition:all 0.2s}
    .np-input:focus{border-color:#1a6b4a;box-shadow:0 0 0 3px rgba(26,107,74,0.1);outline:none}
    .form-check-input:checked{background-color:#1a6b4a;border-color:#1a6b4a}
    .modal-footer-actions{display:flex;gap:12px;justify-content:flex-end}
    .btn-cancel{background:#f0f0f0;color:#555;border:none;border-radius:10px;padding:10px 20px;font-weight:600;cursor:pointer}
    .btn-save{background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;border:none;border-radius:10px;padding:10px 24px;font-weight:600;cursor:pointer}
    .btn-save:disabled{opacity:0.7;cursor:not-allowed}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class ManageAnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  loading = false; saving = false; showForm = false; editingId: any = null;
  form: any = { title:'', content:'', type:'General', priority:'Medium', isActive:true, sendEmail:false, expiryDate:'' };

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAllAnnouncements().subscribe({
      next:(r)=>{ this.announcements=r.announcements||[]; this.loading=false; },
      error:()=>this.loading=false
    });
  }

  openForm() { this.editingId=null; this.form={title:'',content:'',type:'General',priority:'Medium',isActive:true,sendEmail:false,expiryDate:''}; this.showForm=true; }
  editForm(ann: any) { this.editingId=ann._id; this.form={...ann, expiryDate:ann.expiryDate?new Date(ann.expiryDate).toISOString().split('T')[0]:''}; this.showForm=true; }

  save() {
    if (!this.form.title || !this.form.content) { this.toast.warning('Title and content are required'); return; }
    this.saving=true;
    const obs = this.editingId ? this.api.updateAnnouncement(this.editingId, this.form) : this.api.createAnnouncement(this.form);
    obs.subscribe({
      next:()=>{ this.toast.success(this.editingId?'Updated!':'Published!'); this.showForm=false; this.saving=false; this.load(); },
      error:(e)=>{ this.toast.error(e.error?.message||'Error'); this.saving=false; }
    });
  }

  deleteAnn(id: string) {
    if (!confirm('Delete this announcement?')) return;
    this.api.deleteAnnouncement(id).subscribe({
      next:()=>{ this.toast.success('Deleted'); this.load(); },
      error:()=>this.toast.error('Delete failed')
    });
  }
}
