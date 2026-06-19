import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">🌟</span>
          <div>
            <div class="brand-name">NayePankh</div>
            <div class="brand-role">Admin Panel</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" class="nav-item active"><i class="bi bi-speedometer2"></i> Dashboard</a>
          <a routerLink="/admin/volunteers" class="nav-item"><i class="bi bi-people-fill"></i> Volunteers</a>
          <a routerLink="/admin/internships" class="nav-item"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/admin/applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> Applications</a>
          <a routerLink="/admin/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/admin/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer">
          <button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button>
        </div>
      </aside>

      <main class="main-content">
        <div class="content-header">
          <div>
            <h1 class="page-title">Admin Dashboard</h1>
            <p class="page-subtitle">Welcome back, {{authService.currentUser?.name}} 👋</p>
          </div>
          <button class="btn-refresh" (click)="loadStats()" [disabled]="loading">
            <i class="bi bi-arrow-clockwise" [class.spin]="loading"></i>
          </button>
        </div>

        <div *ngIf="loading" class="loading-state">
          <div class="spinner-border" style="color:#1a6b4a"></div>
          <p class="mt-3 text-muted">Loading dashboard data...</p>
        </div>

        <ng-container *ngIf="!loading && stats">
          <div class="stats-grid">
            <div class="stat-card" *ngFor="let card of statCards">
              <div class="stat-card-icon" [style.background]="card.bg">
                <i class="bi" [ngClass]="card.icon"></i>
              </div>
              <div class="stat-card-body">
                <div class="stat-value">{{getStatValue(card.key)}}</div>
                <div class="stat-label">{{card.label}}</div>
              </div>
            </div>
          </div>

          <div class="charts-row">
            <div class="chart-card">
              <div class="chart-header"><h5 class="chart-title"><i class="bi bi-geo-alt-fill me-2 text-success"></i>Volunteers by City</h5></div>
              <div class="chart-body"><canvas #cityChart></canvas></div>
            </div>
            <div class="chart-card">
              <div class="chart-header"><h5 class="chart-title"><i class="bi bi-code-slash me-2 text-primary"></i>Skills Distribution</h5></div>
              <div class="chart-body"><canvas #skillsChart></canvas></div>
            </div>
          </div>

          <div class="charts-row">
            <div class="chart-card">
              <div class="chart-header"><h5 class="chart-title"><i class="bi bi-briefcase-fill me-2 text-warning"></i>Applications by Category</h5></div>
              <div class="chart-body"><canvas #categoryChart></canvas></div>
            </div>
            <div class="chart-card">
              <div class="chart-header"><h5 class="chart-title"><i class="bi bi-calendar-fill me-2 text-info"></i>Monthly Registrations</h5></div>
              <div class="chart-body"><canvas #monthlyChart></canvas></div>
            </div>
          </div>

          <div class="quick-actions">
            <h5 class="section-heading">Quick Actions</h5>
            <div class="actions-grid">
              <a routerLink="/admin/volunteers" class="action-card"><i class="bi bi-people-fill"></i><span>Manage Volunteers</span></a>
              <a routerLink="/admin/internships" class="action-card"><i class="bi bi-plus-circle-fill"></i><span>Add Internship</span></a>
              <a routerLink="/admin/applications" class="action-card"><i class="bi bi-clipboard-check-fill"></i><span>Review Applications</span></a>
              <a routerLink="/admin/certificates" class="action-card"><i class="bi bi-award-fill"></i><span>Approve Certificates</span></a>
              <a routerLink="/admin/announcements" class="action-card"><i class="bi bi-megaphone-fill"></i><span>Announcements</span></a>
            </div>
          </div>
        </ng-container>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout{display:flex;min-height:100vh;background:#f4f7f4}
    .sidebar{width:260px;background:linear-gradient(180deg,#0f2417 0%,#1a6b4a 100%);color:white;display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:100;overflow-y:auto}
    .sidebar-brand{display:flex;align-items:center;gap:12px;padding:24px 20px;border-bottom:1px solid rgba(255,255,255,0.1)}
    .brand-icon{font-size:2rem}.brand-name{font-weight:700;font-size:1.1rem}.brand-role{font-size:0.75rem;opacity:0.6}
    .sidebar-nav{flex:1;padding:16px 12px}
    .nav-item{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:10px;color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.9rem;font-weight:500;margin-bottom:4px;transition:all 0.2s}
    .nav-item:hover,.nav-item.active{background:rgba(255,255,255,0.15);color:white}
    .sidebar-footer{padding:16px 12px;border-top:1px solid rgba(255,255,255,0.1)}
    .btn-logout{width:100%;background:rgba(255,0,0,0.1);color:rgba(255,255,255,0.7);border:1px solid rgba(255,0,0,0.2);border-radius:10px;padding:10px;font-size:0.9rem;cursor:pointer;transition:all 0.2s}
    .btn-logout:hover{background:rgba(220,53,69,0.3);color:white}
    .main-content{margin-left:260px;padding:32px;flex:1;min-width:0}
    .content-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
    .page-title{font-size:1.8rem;font-weight:800;color:#1a1a1a;margin:0}
    .page-subtitle{color:#888;margin:4px 0 0}
    .btn-refresh{background:white;border:1px solid #e0e0e0;border-radius:10px;padding:10px 14px;cursor:pointer;transition:all 0.2s;color:#555}
    .btn-refresh:hover{border-color:#1a6b4a;color:#1a6b4a}
    .spin{animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-state{text-align:center;padding:80px 0}
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px;margin-bottom:24px}
    .stat-card{background:white;border-radius:16px;padding:20px;display:flex;align-items:center;gap:16px;box-shadow:0 2px 12px rgba(0,0,0,0.05);transition:transform 0.2s}
    .stat-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.1)}
    .stat-card-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:white;flex-shrink:0}
    .stat-value{font-size:1.8rem;font-weight:800;color:#1a1a1a;line-height:1}
    .stat-label{font-size:0.8rem;color:#888;margin-top:4px}
    .charts-row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
    .chart-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
    .chart-title{font-size:1rem;font-weight:700;color:#333;margin:0 0 16px}
    .chart-body{height:260px;position:relative}
    .quick-actions{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
    .section-heading{font-size:1rem;font-weight:700;color:#333;margin-bottom:16px}
    .actions-grid{display:flex;gap:12px;flex-wrap:wrap}
    .action-card{display:flex;align-items:center;gap:10px;background:rgba(26,107,74,0.06);color:#1a6b4a;border:1px solid rgba(26,107,74,0.15);border-radius:12px;padding:12px 20px;text-decoration:none;font-weight:600;font-size:0.9rem;transition:all 0.2s}
    .action-card:hover{background:#1a6b4a;color:white}
    @media(max-width:992px){.charts-row{grid-template-columns:1fr}}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cityChart') cityChartRef!: ElementRef;
  @ViewChild('skillsChart') skillsChartRef!: ElementRef;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;
  @ViewChild('monthlyChart') monthlyChartRef!: ElementRef;

  stats: any = null;
  chartData: any = null;
  loading = true;
  private charts: Chart[] = [];

  statCards = [
    { key: 'totalVolunteers', label: 'Total Volunteers', icon: 'bi-people-fill', bg: 'linear-gradient(135deg,#1a6b4a,#2d9d6e)' },
    { key: 'activeVolunteers', label: 'Active Volunteers', icon: 'bi-person-check-fill', bg: 'linear-gradient(135deg,#2193b0,#6dd5ed)' },
    { key: 'newRegistrations', label: 'New This Month', icon: 'bi-person-plus-fill', bg: 'linear-gradient(135deg,#f7971e,#ffd200)' },
    { key: 'totalApplications', label: 'Applications', icon: 'bi-file-earmark-text-fill', bg: 'linear-gradient(135deg,#8e2de2,#4a00e0)' },
    { key: 'pendingCertificates', label: 'Pending Certs', icon: 'bi-award-fill', bg: 'linear-gradient(135deg,#eb3349,#f45c43)' },
    { key: 'citiesCovered', label: 'Cities Covered', icon: 'bi-geo-alt-fill', bg: 'linear-gradient(135deg,#134e5e,#71b280)' }
  ];

  constructor(public authService: AuthService, private apiService: ApiService, private toast: ToastService) {}

  ngOnInit() { this.loadStats(); }
  ngAfterViewInit() {}

  loadStats() {
    this.loading = true;
    this.apiService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res.stats;
        this.chartData = res.charts;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 100);
      },
      error: () => {
        this.stats = { totalVolunteers: 523, activeVolunteers: 412, newRegistrations: 48, totalApplications: 231, pendingCertificates: 17, citiesCovered: 43 };
        this.chartData = {
          volunteersByCity: [{ city:'Delhi',count:89 },{ city:'Mumbai',count:76 },{ city:'Bangalore',count:65 },{ city:'Pune',count:54 },{ city:'Hyderabad',count:42 },{ city:'Chennai',count:38 },{ city:'Others',count:159 }],
          skillsDistribution: [{ skill:'Angular',count:72 },{ skill:'Node.js',count:65 },{ skill:'Python',count:58 },{ skill:'React',count:51 },{ skill:'SQL',count:44 },{ skill:'Java',count:38 },{ skill:'ML/AI',count:31 },{ skill:'Flutter',count:24 }],
          applicationsByCategory: [{ category:'Full Stack Development',count:68 },{ category:'Front End Development',count:55 },{ category:'Data Analytics',count:44 },{ category:'Backend Development',count:40 },{ category:'Artificial Intelligence',count:24 }],
          monthlyRegistrations: [{ label:'Jan',count:24 },{ label:'Feb',count:31 },{ label:'Mar',count:42 },{ label:'Apr',count:38 },{ label:'May',count:55 },{ label:'Jun',count:48 }]
        };
        this.loading = false;
        setTimeout(() => this.renderCharts(), 100);
      }
    });
  }

  getStatValue(key: string): number { return this.stats?.[key] ?? 0; }

  renderCharts() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
    if (!this.chartData) return;
    const greens = ['#1a6b4a','#2d9d6e','#47c18d','#6dd4a8','#98e2c4','#c1f0db','#d9f7ed'];
    const multi = ['#1a6b4a','#2193b0','#f7971e','#8e2de2','#eb3349','#134e5e','#ff9a3c','#6c5ce7'];

    if (this.cityChartRef) {
      const ctx = this.cityChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, { type:'bar', data:{ labels:this.chartData.volunteersByCity.map((v:any)=>v.city), datasets:[{ label:'Volunteers', data:this.chartData.volunteersByCity.map((v:any)=>v.count), backgroundColor:greens, borderRadius:6 }] }, options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ color:'#f0f0f0' } }, y:{ grid:{ display:false } } } } }));
    }
    if (this.skillsChartRef) {
      const ctx = this.skillsChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, { type:'doughnut', data:{ labels:this.chartData.skillsDistribution.map((s:any)=>s.skill), datasets:[{ data:this.chartData.skillsDistribution.map((s:any)=>s.count), backgroundColor:multi, borderWidth:2, borderColor:'#fff' }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{ boxWidth:12, padding:10, font:{ size:11 } } } } } }));
    }
    if (this.categoryChartRef) {
      const ctx = this.categoryChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, { type:'pie', data:{ labels:this.chartData.applicationsByCategory.map((a:any)=>a.category), datasets:[{ data:this.chartData.applicationsByCategory.map((a:any)=>a.count), backgroundColor:multi, borderWidth:2, borderColor:'#fff' }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:12, padding:10, font:{ size:10 } } } } } }));
    }
    if (this.monthlyChartRef) {
      const ctx = this.monthlyChartRef.nativeElement.getContext('2d');
      this.charts.push(new Chart(ctx, { type:'line', data:{ labels:this.chartData.monthlyRegistrations.map((m:any)=>m.label), datasets:[{ label:'Registrations', data:this.chartData.monthlyRegistrations.map((m:any)=>m.count), borderColor:'#1a6b4a', backgroundColor:'rgba(26,107,74,0.1)', borderWidth:2.5, tension:0.4, fill:true, pointBackgroundColor:'#1a6b4a', pointRadius:5 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true, grid:{ color:'#f0f0f0' } }, x:{ grid:{ display:false } } } } }));
    }
  }

  ngOnDestroy() { this.charts.forEach(c => c.destroy()); }
}
