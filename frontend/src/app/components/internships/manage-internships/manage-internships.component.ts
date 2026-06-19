import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-manage-internships',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Admin Panel</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item"><i class="bi bi-speedometer2"></i> Dashboard</a>
          <a routerLink="/admin/volunteers" class="nav-item"><i class="bi bi-people-fill"></i> Volunteers</a>
          <a routerLink="/admin/internships" class="nav-item active"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/admin/applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> Applications</a>
          <a routerLink="/admin/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/admin/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header">
          <div><h1 class="page-title">Internships</h1><p class="page-subtitle">Manage internship listings</p></div>
          <button class="btn-add" (click)="openForm()"><i class="bi bi-plus-lg me-2"></i>Add Internship</button>
        </div>
        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>
        <div class="internships-grid" *ngIf="!loading">
          <div *ngFor="let int of internships" class="int-admin-card">
            <div class="iac-header">
              <div class="iac-icon">{{getCategoryIcon(int.category)}}</div>
              <div class="iac-status" [class.active]="int.isActive" [class.inactive]="!int.isActive">{{int.isActive ? 'Active' : 'Closed'}}</div>
            </div>
            <h5 class="iac-title">{{int.title}}</h5>
            <div class="iac-category">{{int.category}}</div>
            <p class="iac-desc text-muted small">{{int.description | slice:0:100}}...</p>
            <div class="iac-meta">
              <span><i class="bi bi-clock me-1"></i>{{int.duration}}</span>
              <span><i class="bi bi-people me-1"></i>{{int.openings}} seats</span>
              <span><i class="bi bi-currency-rupee me-1"></i>{{int.stipend}}</span>
            </div>
            <div class="iac-actions">
              <button class="btn-edit" (click)="editForm(int)"><i class="bi bi-pencil-fill"></i> Edit</button>
              <button class="btn-toggle" (click)="toggleActive(int)">{{int.isActive ? 'Close' : 'Activate'}}</button>
              <button class="btn-del" (click)="deleteInternship(int._id)"><i class="bi bi-trash-fill"></i></button>
            </div>
          </div>
          <div *ngIf="internships.length === 0" class="empty-state-full">
            <i class="bi bi-briefcase" style="font-size:3rem;color:#aaa;display:block;margin-bottom:12px"></i>
            <p class="text-muted">No internships yet. Add one!</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Form Modal -->
    <div class="modal-overlay" *ngIf="showForm" (click)="showForm=false">
      <div class="modal-card large" (click)="$event.stopPropagation()">
        <div class="modal-header-np">
          <h5>{{editingId ? 'Edit' : 'Add'}} Internship</h5>
          <button class="modal-close" (click)="showForm=false"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body-np">
          <div class="row g-3">
            <div class="col-md-6"><label class="form-label">Title *</label><input type="text" class="form-control np-input" [(ngModel)]="form.title"></div>
            <div class="col-md-6">
              <label class="form-label">Category *</label>
              <select class="form-select np-input" [(ngModel)]="form.category">
                <option *ngFor="let c of categories" [value]="c">{{c}}</option>
              </select>
            </div>
            <div class="col-12"><label class="form-label">Description *</label><textarea class="form-control np-input" rows="3" [(ngModel)]="form.description"></textarea></div>
            <div class="col-md-4"><label class="form-label">Duration</label><input type="text" class="form-control np-input" [(ngModel)]="form.duration" placeholder="3 months"></div>
            <div class="col-md-4"><label class="form-label">Stipend</label><input type="text" class="form-control np-input" [(ngModel)]="form.stipend" placeholder="Unpaid / ₹5000"></div>
            <div class="col-md-4"><label class="form-label">Openings</label><input type="number" class="form-control np-input" [(ngModel)]="form.openings" min="1"></div>
            <div class="col-md-6"><label class="form-label">Skills (comma separated)</label><input type="text" class="form-control np-input" [(ngModel)]="form.skillsStr" placeholder="Angular, Node.js, MongoDB"></div>
            <div class="col-md-6"><label class="form-label">Deadline</label><input type="date" class="form-control np-input" [(ngModel)]="form.deadline"></div>
            <div class="col-12"><label class="form-label">Requirements (one per line)</label><textarea class="form-control np-input" rows="3" [(ngModel)]="form.requirementsStr" placeholder="Must know Angular&#10;Good communication skills"></textarea></div>
          </div>
          <div class="modal-footer-actions">
            <button class="btn-cancel" (click)="showForm=false">Cancel</button>
            <button class="btn-save" (click)="save()" [disabled]="saving">
              <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{saving ? 'Saving...' : 'Save Internship'}}
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
    .btn-add:hover{background:#155a3d}
    .loading-state{text-align:center;padding:80px 0}
    .internships-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
    .int-admin-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);display:flex;flex-direction:column;gap:10px;transition:all 0.2s}
    .int-admin-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1)}
    .iac-header{display:flex;justify-content:space-between;align-items:center}
    .iac-icon{font-size:2rem}
    .iac-status{padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:600}
    .iac-status.active{background:#e8f5ee;color:#1a6b4a}.iac-status.inactive{background:#fde8e8;color:#c62828}
    .iac-title{font-weight:700;color:#1a1a1a;font-size:1rem;margin:0}
    .iac-category{color:#1a6b4a;font-size:0.82rem;font-weight:600}
    .iac-meta{display:flex;gap:12px;font-size:0.82rem;color:#888;flex-wrap:wrap}
    .iac-actions{display:flex;gap:8px;margin-top:4px}
    .btn-edit{background:rgba(26,107,74,0.08);color:#1a6b4a;border:1px solid rgba(26,107,74,0.2);border-radius:8px;padding:6px 14px;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
    .btn-edit:hover{background:#1a6b4a;color:white}
    .btn-toggle{background:rgba(33,147,176,0.08);color:#2193b0;border:1px solid rgba(33,147,176,0.2);border-radius:8px;padding:6px 14px;font-size:0.85rem;cursor:pointer;transition:all 0.2s}
    .btn-toggle:hover{background:#2193b0;color:white}
    .btn-del{background:rgba(220,53,69,0.08);color:#dc3545;border:1px solid rgba(220,53,69,0.2);border-radius:8px;padding:6px 10px;font-size:0.85rem;cursor:pointer;margin-left:auto;transition:all 0.2s}
    .btn-del:hover{background:#dc3545;color:white}
    .empty-state-full{grid-column:1/-1;text-align:center;padding:60px}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-card{background:white;border-radius:20px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    .modal-card.large{max-width:720px}
    .modal-header-np{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header-np h5{font-weight:700;margin:0}.modal-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#666;padding:4px 8px;border-radius:8px}
    .modal-body-np{padding:24px}
    .form-label{font-size:0.9rem;font-weight:600;color:#444;margin-bottom:6px}
    .np-input{border-radius:10px;border:1.5px solid #e0e0e0;padding:10px 14px;font-size:0.95rem;transition:all 0.2s}
    .np-input:focus{border-color:#1a6b4a;box-shadow:0 0 0 3px rgba(26,107,74,0.1);outline:none}
    .modal-footer-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:20px}
    .btn-cancel{background:#f0f0f0;color:#555;border:none;border-radius:10px;padding:10px 20px;font-weight:600;cursor:pointer}
    .btn-save{background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;border:none;border-radius:10px;padding:10px 24px;font-weight:600;cursor:pointer;transition:all 0.2s}
    .btn-save:disabled{opacity:0.7;cursor:not-allowed}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class ManageInternshipsComponent implements OnInit {
  internships: any[] = [];
  loading = false; saving = false; showForm = false; editingId: any = null;
  categories = ['Front End Development','Full Stack Development','Backend Development','Artificial Intelligence','Data Analytics'];
  form: any = { title:'', category:'Front End Development', description:'', duration:'3 months', stipend:'Unpaid', openings:5, skillsStr:'', requirementsStr:'', deadline:'' };

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getAllInternships().subscribe({ next:(r)=>{this.internships=r.internships||[];this.loading=false;}, error:()=>this.loading=false });
  }

  openForm() { this.editingId=null; this.form={title:'',category:'Front End Development',description:'',duration:'3 months',stipend:'Unpaid',openings:5,skillsStr:'',requirementsStr:'',deadline:''}; this.showForm=true; }

  editForm(int: any) {
    this.editingId=int._id;
    this.form={...int, skillsStr:(int.skills||[]).join(', '), requirementsStr:(int.requirements||[]).join('\n'), deadline: int.deadline ? new Date(int.deadline).toISOString().split('T')[0] : ''};
    this.showForm=true;
  }

  save() {
    this.saving=true;
    const data = {...this.form, skills: this.form.skillsStr.split(',').map((s:string)=>s.trim()).filter((s:string)=>s), requirements: this.form.requirementsStr.split('\n').map((s:string)=>s.trim()).filter((s:string)=>s)};
    const obs = this.editingId ? this.api.updateInternship(this.editingId, data) : this.api.createInternship(data);
    obs.subscribe({
      next:()=>{ this.toast.success(this.editingId?'Updated!':'Created!'); this.showForm=false; this.saving=false; this.load(); },
      error:(e)=>{ this.toast.error(e.error?.message||'Error'); this.saving=false; }
    });
  }

  toggleActive(int: any) {
    this.api.updateInternship(int._id, {isActive: !int.isActive}).subscribe({
      next:()=>{ int.isActive=!int.isActive; this.toast.success('Status updated'); },
      error:()=>this.toast.error('Failed to update')
    });
  }

  deleteInternship(id: string) {
    if(!confirm('Delete this internship?')) return;
    this.api.deleteInternship(id).subscribe({ next:()=>{ this.toast.success('Deleted'); this.load(); }, error:()=>this.toast.error('Delete failed') });
  }

  getCategoryIcon(cat: string): string {
    const m: any={'Front End Development':'🎨','Full Stack Development':'⚡','Backend Development':'🔧','Artificial Intelligence':'🤖','Data Analytics':'📊'};
    return m[cat]||'💼';
  }
}
