import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-volunteer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-brand"><span class="brand-icon">🌟</span><div><div class="brand-name">NayePankh</div><div class="brand-role">Volunteer Portal</div></div></div>
        <nav class="sidebar-nav">
          <a routerLink="/volunteer/dashboard" class="nav-item"><i class="bi bi-house-fill"></i> Dashboard</a>
          <a routerLink="/volunteer/profile" class="nav-item active"><i class="bi bi-person-fill"></i> My Profile</a>
          <a routerLink="/volunteer/internships" class="nav-item"><i class="bi bi-briefcase-fill"></i> Internships</a>
          <a routerLink="/volunteer/my-applications" class="nav-item"><i class="bi bi-file-earmark-text-fill"></i> My Applications</a>
          <a routerLink="/volunteer/certificates" class="nav-item"><i class="bi bi-award-fill"></i> Certificates</a>
          <a routerLink="/volunteer/announcements" class="nav-item"><i class="bi bi-megaphone-fill"></i> Announcements</a>
        </nav>
        <div class="sidebar-footer"><button class="btn-logout" (click)="authService.logout()"><i class="bi bi-box-arrow-right"></i> Logout</button></div>
      </aside>
      <main class="main-content">
        <div class="content-header"><h1 class="page-title">My Profile</h1><p class="page-subtitle">Complete your volunteer profile</p></div>

        <div class="row g-4">
          <div class="col-lg-4">
            <div class="profile-sidebar-card">
              <div class="profile-avatar">{{authService.currentUser?.name?.charAt(0)}}</div>
              <h5>{{authService.currentUser?.name}}</h5>
              <p class="text-muted small">{{authService.currentUser?.email}}</p>
              <div class="completion-ring" *ngIf="profile">
                <div class="ring-label">Profile Completeness</div>
                <div class="ring-value">{{completionPct}}%</div>
                <div class="progress mt-2" style="height:8px;border-radius:4px">
                  <div class="progress-bar" style="background:#1a6b4a" [style.width]="completionPct + '%'"></div>
                </div>
              </div>
              <div *ngIf="recommendation" class="rec-box">
                <div class="rec-header">🤖 AI Role Recommendation</div>
                <div class="rec-role-name">{{recommendation.role}}</div>
                <div class="rec-confidence">Confidence: {{recommendation.confidence}}%</div>
                <div *ngIf="recommendation.matches?.length" class="rec-matches">
                  Matched: {{recommendation.matches.slice(0,3).join(', ')}}
                </div>
                <div *ngIf="recommendation.alternatives?.length" class="rec-alts">
                  <span>Also suitable: </span>
                  <span *ngFor="let a of recommendation.alternatives" class="alt-tag">{{a}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="form-card">
              <div class="form-card-header">
                <h5>{{profile ? 'Update' : 'Create'}} Volunteer Profile</h5>
              </div>
              <form (ngSubmit)="saveProfile()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Full Name *</label>
                    <input type="text" class="form-control np-input" [(ngModel)]="form.fullName" name="fullName" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control np-input" [(ngModel)]="form.email" name="email" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone *</label>
                    <input type="tel" class="form-control np-input" [(ngModel)]="form.phone" name="phone" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">City *</label>
                    <input type="text" class="form-control np-input" [(ngModel)]="form.city" name="city" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Education *</label>
                    <input type="text" class="form-control np-input" [(ngModel)]="form.education" name="education" placeholder="B.Tech CS, 3rd Year" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Availability *</label>
                    <select class="form-select np-input" [(ngModel)]="form.availability" name="availability">
                      <option>Full-Time</option><option>Part-Time</option><option>Weekends</option><option>Flexible</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Interest Area</label>
                    <select class="form-select np-input" [(ngModel)]="form.interestArea" name="interestArea">
                      <option>Technology</option><option>Education</option><option>Healthcare</option>
                      <option>Environment</option><option>Community Development</option><option>Other</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Address</label>
                    <input type="text" class="form-control np-input" [(ngModel)]="form.address" name="address">
                  </div>
                  <div class="col-12">
                    <label class="form-label">Skills * <span class="text-muted small">(comma separated)</span></label>
                    <input type="text" class="form-control np-input" [(ngModel)]="skillsInput" name="skills"
                      placeholder="Angular, Node.js, Python, MongoDB" (input)="onSkillsChange()">
                    <div class="skill-preview mt-2">
                      <span *ngFor="let s of parsedSkills" class="skill-preview-tag">{{s}}</span>
                    </div>
                  </div>
                </div>
                <div class="form-actions mt-4">
                  <button type="submit" class="btn-save" [disabled]="saving">
                    <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                    {{saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}}
                  </button>
                </div>
              </form>
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
    .content-header{margin-bottom:28px}.page-title{font-size:1.8rem;font-weight:800;color:#1a1a1a;margin:0}.page-subtitle{color:#888;margin:4px 0 0}
    .profile-sidebar-card{background:white;border-radius:16px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,0.05);text-align:center}
    .profile-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;margin:0 auto 16px}
    .completion-ring{margin-top:16px;text-align:left;background:#f8fcfa;border-radius:12px;padding:12px}
    .ring-label{font-size:0.8rem;color:#888;margin-bottom:4px}
    .ring-value{font-size:1.5rem;font-weight:800;color:#1a6b4a}
    .rec-box{margin-top:16px;background:linear-gradient(135deg,rgba(26,107,74,0.05),rgba(45,157,110,0.08));border:1px solid rgba(26,107,74,0.2);border-radius:12px;padding:16px;text-align:left}
    .rec-header{font-size:0.78rem;color:#888;margin-bottom:6px}
    .rec-role-name{font-size:1.1rem;font-weight:700;color:#1a6b4a;margin-bottom:4px}
    .rec-confidence{font-size:0.8rem;color:#555;margin-bottom:6px}
    .rec-matches{font-size:0.8rem;color:#666;margin-bottom:8px}
    .rec-alts{font-size:0.8rem;color:#888}
    .alt-tag{background:rgba(26,107,74,0.08);color:#1a6b4a;padding:2px 8px;border-radius:12px;font-size:0.75rem;margin-left:4px}
    .form-card{background:white;border-radius:16px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,0.05)}
    .form-card-header{margin-bottom:20px}.form-card-header h5{font-weight:700;color:#1a1a1a;margin:0}
    .form-label{font-size:0.9rem;font-weight:600;color:#444;margin-bottom:6px}
    .np-input{border-radius:10px;border:1.5px solid #e0e0e0;padding:10px 14px;font-size:0.95rem;transition:all 0.2s}
    .np-input:focus{border-color:#1a6b4a;box-shadow:0 0 0 3px rgba(26,107,74,0.1);outline:none}
    .skill-preview{display:flex;flex-wrap:wrap;gap:6px;min-height:24px}
    .skill-preview-tag{background:rgba(26,107,74,0.08);color:#1a6b4a;padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:500}
    .form-actions{display:flex;justify-content:flex-end}
    .btn-save{background:linear-gradient(135deg,#1a6b4a,#2d9d6e);color:white;border:none;border-radius:10px;padding:12px 32px;font-weight:600;font-size:0.95rem;cursor:pointer;transition:all 0.2s}
    .btn-save:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(26,107,74,0.3)}
    .btn-save:disabled{opacity:0.7;cursor:not-allowed}
    @media(max-width:768px){.sidebar{display:none}.main-content{margin-left:0;padding:16px}}
  `]
})
export class VolunteerProfileComponent implements OnInit {
  profile: any = null;
  recommendation: any = null;
  form: any = { fullName: '', email: '', phone: '', city: '', address: '', education: '', availability: 'Flexible', interestArea: 'Technology' };
  skillsInput = '';
  parsedSkills: string[] = [];
  saving = false;
  completionPct = 0;

  constructor(public authService: AuthService, private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.form.fullName = this.authService.currentUser?.name || '';
    this.form.email = this.authService.currentUser?.email || '';
    this.api.getMyVolunteerProfile().subscribe({
      next: (r) => {
        this.profile = r.volunteer;
        if (this.profile) {
          this.form = { ...this.profile };
          this.skillsInput = this.profile.skills?.join(', ') || '';
          this.parsedSkills = this.profile.skills || [];
          this.calcCompletion();
          this.getRecommendation();
        }
      },
      error: () => {}
    });
  }

  onSkillsChange() {
    this.parsedSkills = this.skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (this.parsedSkills.length > 0) this.getRecommendation();
  }

  getRecommendation() {
    this.api.getRecommendation(this.parsedSkills).subscribe({
      next: (r) => this.recommendation = r.recommendation,
      error: () => {}
    });
  }

  calcCompletion() {
    const fields = ['fullName', 'email', 'phone', 'city', 'education', 'availability', 'interestArea'];
    const filled = fields.filter(f => this.form[f]).length;
    const skillsBonus = this.parsedSkills.length > 0 ? 1 : 0;
    this.completionPct = Math.round(((filled + skillsBonus) / (fields.length + 1)) * 100);
  }

  saveProfile() {
    this.saving = true;
    const data = { ...this.form, skills: this.parsedSkills };

    if (this.profile) {
      this.api.updateVolunteer(this.profile._id, data).subscribe({
        next: () => { this.toast.success('Profile updated!'); this.saving = false; },
        error: (e) => { this.toast.error(e.error?.message || 'Update failed'); this.saving = false; }
      });
    } else {
      this.api.createVolunteer(data).subscribe({
        next: (r) => { this.profile = r.volunteer; this.toast.success('Profile created!'); this.saving = false; this.calcCompletion(); },
        error: (e) => { this.toast.error(e.error?.message || 'Creation failed'); this.saving = false; }
      });
    }
  }
}
