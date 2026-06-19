import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-volunteer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Admin Panel</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item"><i class="bi bi-speedometer2"></i> Dashboard</a>
          <a routerLink="/admin/volunteers" class="nav-item active"><i class="bi bi-people-fill"></i> Volunteers</a>
          <a routerLink="/admin/internships" class="nav-item"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/admin/applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> Applications</a>
          <a routerLink="/admin/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/admin/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header">
          <div><h1 class="page-title">Volunteers</h1><p class="page-subtitle">Manage all registered volunteers</p></div>
        </div>

        <!-- Filters -->
        <div class="filter-bar">
          <div class="search-box">
            <i class="bi bi-search search-icon"></i>
            <input type="text" class="form-control search-input" placeholder="Search volunteers..." [(ngModel)]="filters.search" (input)="onSearch()">
          </div>
          <select class="form-select filter-select" [(ngModel)]="filters.city" (change)="loadVolunteers()">
            <option value="">All Cities</option>
            <option *ngFor="let c of cities" [value]="c">{{c}}</option>
          </select>
          <select class="form-select filter-select" [(ngModel)]="filters.availability" (change)="loadVolunteers()">
            <option value="">All Availability</option>
            <option>Full-Time</option><option>Part-Time</option><option>Weekends</option><option>Flexible</option>
          </select>
          <button class="btn-reset" (click)="resetFilters()"><i class="bi bi-x-circle me-1"></i>Reset</button>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-state"><div class="spinner-border" style="color:#1a6b4a"></div></div>

        <!-- Table -->
        <div class="table-card" *ngIf="!loading">
          <div class="table-header">
            <span class="table-count">{{total}} volunteers found</span>
          </div>
          <div class="table-responsive">
            <table class="table np-table">
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th><th>City</th><th>Skills</th>
                  <th>Availability</th><th>Status</th><th>Recommended Role</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let v of volunteers; let i = index">
                  <td class="text-muted">{{(page-1)*limit + i + 1}}</td>
                  <td>
                    <div class="vol-name-cell">
                      <div class="vol-avatar">{{v.fullName?.charAt(0)}}</div>
                      <div>
                        <div class="fw-600">{{v.fullName}}</div>
                        <div class="text-muted small">{{v.phone}}</div>
                      </div>
                    </div>
                  </td>
                  <td class="text-muted small">{{v.email}}</td>
                  <td><i class="bi bi-geo-alt text-success me-1"></i>{{v.city}}</td>
                  <td>
                    <div class="skills-mini">
                      <span *ngFor="let s of v.skills?.slice(0,2)" class="skill-mini-tag">{{s}}</span>
                      <span *ngIf="v.skills?.length > 2" class="skill-more">+{{v.skills.length - 2}}</span>
                    </div>
                  </td>
                  <td><span class="avail-badge avail-{{v.availability?.toLowerCase().replace(' ','-')}}">{{v.availability}}</span></td>
                  <td><span class="status-dot" [ngClass]="v.status === 'Active' ? 'dot-active' : 'dot-inactive'"></span>{{v.status}}</td>
                  <td class="text-muted small">{{v.recommendedRole || '—'}}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn-action btn-view" (click)="viewVolunteer(v)" title="View"><i class="bi bi-eye-fill"></i></button>
                      <button class="btn-action btn-delete" (click)="deleteVolunteer(v._id)" title="Delete"><i class="bi bi-trash-fill"></i></button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="volunteers.length === 0">
                  <td colspan="9" class="text-center text-muted py-4">No volunteers found</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="pagination-bar" *ngIf="pages > 1">
            <button class="pg-btn" [disabled]="page === 1" (click)="goPage(page-1)"><i class="bi bi-chevron-left"></i></button>
            <span class="pg-info">Page {{page}} of {{pages}}</span>
            <button class="pg-btn" [disabled]="page === pages" (click)="goPage(page+1)"><i class="bi bi-chevron-right"></i></button>
          </div>
        </div>
      </main>
    </div>

    <!-- View Modal -->
    <div class="modal-overlay" *ngIf="selectedVolunteer" (click)="selectedVolunteer=null">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header-np">
          <h5>Volunteer Details</h5>
          <button class="modal-close" (click)="selectedVolunteer=null"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body-np">
          <div class="detail-grid">
            <div class="detail-item"><span class="detail-label">Full Name</span><span class="detail-value">{{selectedVolunteer.fullName}}</span></div>
            <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">{{selectedVolunteer.email}}</span></div>
            <div class="detail-item"><span class="detail-label">Phone</span><span class="detail-value">{{selectedVolunteer.phone}}</span></div>
            <div class="detail-item"><span class="detail-label">City</span><span class="detail-value">{{selectedVolunteer.city}}</span></div>
            <div class="detail-item"><span class="detail-label">Education</span><span class="detail-value">{{selectedVolunteer.education}}</span></div>
            <div class="detail-item"><span class="detail-label">Availability</span><span class="detail-value">{{selectedVolunteer.availability}}</span></div>
            <div class="detail-item"><span class="detail-label">Interest Area</span><span class="detail-value">{{selectedVolunteer.interestArea}}</span></div>
            <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">{{selectedVolunteer.status}}</span></div>
            <div class="detail-item full-width"><span class="detail-label">Skills</span><div class="skills-tags mt-1"><span *ngFor="let s of selectedVolunteer.skills" class="skill-tag">{{s}}</span></div></div>
            <div class="detail-item full-width"><span class="detail-label">Recommended Role</span><span class="detail-value" style="color:#1a6b4a;font-weight:700">{{selectedVolunteer.recommendedRole || 'N/A'}}</span></div>
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
    .content-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
    .page-title{font-size:1.8rem;font-weight:800;color:#1a1a1a;margin:0}.page-subtitle{color:#888;margin:4px 0 0}
    .filter-bar{display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap}
    .search-box{position:relative;flex:1;min-width:200px}
    .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#aaa}
    .search-input{padding-left:36px;border-radius:10px;border:1.5px solid #e0e0e0}
    .search-input:focus{border-color:#1a6b4a;box-shadow:0 0 0 3px rgba(26,107,74,0.1)}
    .filter-select{border-radius:10px;border:1.5px solid #e0e0e0;min-width:160px;max-width:200px}
    .filter-select:focus{border-color:#1a6b4a;box-shadow:none}
    .btn-reset{background:white;border:1.5px solid #e0e0e0;border-radius:10px;padding:8px 16px;color:#666;cursor:pointer;font-size:0.9rem;transition:all 0.2s;white-space:nowrap}
    .btn-reset:hover{border-color:#dc3545;color:#dc3545}
    .loading-state{text-align:center;padding:80px 0}
    .table-card{background:white;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.05);overflow:hidden}
    .table-header{padding:16px 20px;border-bottom:1px solid #f0f0f0}
    .table-count{font-size:0.9rem;color:#888;font-weight:500}
    .np-table{margin:0}.np-table th{background:#f8fcfa;color:#444;font-weight:600;font-size:0.85rem;border-bottom:2px solid #e8f5ee;padding:12px 16px;white-space:nowrap}
    .np-table td{padding:14px 16px;vertical-align:middle;border-bottom:1px solid #f8f8f8;font-size:0.9rem}
    .np-table tbody tr:hover{background:#fafff9}
    .vol-name-cell{display:flex;align-items:center;gap:10px}
    .vol-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0}
    .fw-600{font-weight:600}
    .skills-mini{display:flex;gap:4px;flex-wrap:wrap}
    .skill-mini-tag{background:rgba(26,107,74,0.08);color:#1a6b4a;padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:500}
    .skill-more{background:#e0e0e0;color:#666;padding:2px 8px;border-radius:20px;font-size:0.72rem}
    .avail-badge{padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:600}
    .avail-full-time{background:#e8f5ee;color:#1a6b4a}.avail-part-time{background:#fff3e0;color:#e65100}
    .avail-weekends{background:#e3f2fd;color:#1565c0}.avail-flexible{background:#f3e5f5;color:#6a1b9a}
    .status-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px}
    .dot-active{background:#1a6b4a}.dot-inactive{background:#dc3545}
    .action-btns{display:flex;gap:6px}
    .btn-action{width:32px;height:32px;border-radius:8px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;font-size:0.85rem}
    .btn-view{background:rgba(26,107,74,0.1);color:#1a6b4a}.btn-view:hover{background:#1a6b4a;color:white}
    .btn-delete{background:rgba(220,53,69,0.1);color:#dc3545}.btn-delete:hover{background:#dc3545;color:white}
    .pagination-bar{display:flex;align-items:center;justify-content:center;gap:12px;padding:16px;border-top:1px solid #f0f0f0}
    .pg-btn{background:white;border:1.5px solid #e0e0e0;border-radius:8px;padding:6px 12px;cursor:pointer}
    .pg-btn:hover:not(:disabled){border-color:#1a6b4a;color:#1a6b4a}.pg-btn:disabled{opacity:0.4;cursor:not-allowed}
    .pg-info{font-size:0.85rem;color:#666}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-card{background:white;border-radius:20px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)}
    .modal-header-np{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #f0f0f0}
    .modal-header-np h5{font-weight:700;margin:0}
    .modal-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#666;padding:4px 8px;border-radius:8px}
    .modal-close:hover{background:#f0f0f0}
    .modal-body-np{padding:24px}
    .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .detail-item{background:#f8fcfa;border-radius:10px;padding:12px}
    .full-width{grid-column:1/-1}
    .detail-label{display:block;font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
    .detail-value{font-weight:600;color:#333}
    .skills-tags{display:flex;flex-wrap:wrap;gap:6px}
    .skill-tag{background:rgba(26,107,74,0.08);color:#1a6b4a;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:500}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class VolunteerListComponent implements OnInit {
  volunteers: any[] = [];
  cities = ['Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur'];
  filters = { search: '', city: '', availability: '' };
  loading = false;
  total = 0; page = 1; limit = 10; pages = 1;
  selectedVolunteer: any = null;
  searchTimeout: any;

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.loadVolunteers(); }

  loadVolunteers() {
    this.loading = true;
    this.api.getAllVolunteers({ ...this.filters, page: this.page, limit: this.limit }).subscribe({
      next: (r) => { this.volunteers = r.volunteers || []; this.total = r.total || 0; this.pages = r.pages || 1; this.loading = false; },
      error: () => { this.loading = false; this.toast.error('Failed to load volunteers'); }
    });
  }

  onSearch() { clearTimeout(this.searchTimeout); this.searchTimeout = setTimeout(() => this.loadVolunteers(), 400); }
  resetFilters() { this.filters = { search: '', city: '', availability: '' }; this.page = 1; this.loadVolunteers(); }
  goPage(p: number) { this.page = p; this.loadVolunteers(); }
  viewVolunteer(v: any) { this.selectedVolunteer = v; }

  deleteVolunteer(id: string) {
    if (!confirm('Delete this volunteer?')) return;
    this.api.deleteVolunteer(id).subscribe({
      next: () => { this.toast.success('Volunteer deleted'); this.loadVolunteers(); },
      error: () => this.toast.error('Failed to delete volunteer')
    });
  }
}
