import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo">🌟</div>
            <h2>Welcome Back</h2>
            <p class="text-muted">Sign in to your NayePankh account</p>
          </div>

          <form (ngSubmit)="onLogin()" #loginForm="ngForm">
            <div class="mb-3">
              <label class="form-label fw-600">Email Address</label>
              <div class="input-group-np">
                <i class="bi bi-envelope input-icon"></i>
                <input
                  type="email" class="form-control form-control-np" placeholder="your@email.com"
                  [(ngModel)]="email" name="email" required
                  [class.is-invalid]="submitted && !email">
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-600">Password</label>
              <div class="input-group-np">
                <i class="bi bi-lock input-icon"></i>
                <input
                  [type]="showPass ? 'text' : 'password'" class="form-control form-control-np"
                  placeholder="Your password" [(ngModel)]="password" name="password" required
                  [class.is-invalid]="submitted && !password">
                <i class="bi input-icon-end" [class.bi-eye]="!showPass" [class.bi-eye-slash]="showPass"
                   (click)="showPass = !showPass" style="cursor:pointer"></i>
              </div>
            </div>

            <button type="submit" class="btn btn-auth w-100" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{loading ? 'Signing in...' : 'Sign In'}}
            </button>
          </form>

          <div class="auth-divider"><span>or</span></div>

          <div class="demo-accounts">
            <p class="text-muted small mb-2">Quick Demo Login:</p>
            <div class="d-flex gap-2">
              <button class="btn btn-demo" (click)="loginAs('admin')">
                <i class="bi bi-shield-fill me-1"></i> Admin
              </button>
              <button class="btn btn-demo" (click)="loginAs('volunteer')">
                <i class="bi bi-person-fill me-1"></i> Volunteer
              </button>
            </div>
          </div>

          <p class="text-center mt-4 text-muted">
            New to NayePankh? <a routerLink="/register" class="auth-link">Create account</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; background: linear-gradient(135deg, #f0faf5 0%, #e8f5ee 100%); display: flex; align-items: center; justify-content: center; padding: 24px; }
    .auth-container { width: 100%; max-width: 440px; }
    .auth-card { background: white; border-radius: 24px; padding: 48px 40px; box-shadow: 0 20px 60px rgba(26,107,74,0.1); }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 3rem; margin-bottom: 12px; }
    .auth-header h2 { font-weight: 800; color: #1a1a1a; }
    .form-label { color: #444; font-size: 0.9rem; margin-bottom: 6px; }
    .fw-600 { font-weight: 600; }
    .input-group-np { position: relative; }
    .input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #aaa; z-index: 2; }
    .input-icon-end { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #aaa; z-index: 2; }
    .form-control-np { padding: 12px 40px 12px 40px; border-radius: 10px; border: 1.5px solid #e0e0e0; font-size: 0.95rem; transition: all 0.2s; }
    .form-control-np:focus { border-color: #1a6b4a; box-shadow: 0 0 0 3px rgba(26,107,74,0.1); outline: none; }
    .btn-auth { background: linear-gradient(135deg, #1a6b4a, #2d9d6e); color: white; border: none; padding: 14px; border-radius: 10px; font-size: 1rem; font-weight: 600; transition: all 0.2s; }
    .btn-auth:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(26,107,74,0.3); color: white; }
    .btn-auth:disabled { opacity: 0.7; }
    .auth-divider { text-align: center; margin: 24px 0; position: relative; }
    .auth-divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #e0e0e0; }
    .auth-divider span { background: white; padding: 0 12px; color: #aaa; font-size: 0.85rem; position: relative; }
    .demo-accounts { text-align: center; }
    .btn-demo { background: rgba(26,107,74,0.08); color: #1a6b4a; border: 1px solid rgba(26,107,74,0.2); border-radius: 8px; padding: 8px 16px; font-size: 0.85rem; font-weight: 600; transition: all 0.2s; flex: 1; }
    .btn-demo:hover { background: #1a6b4a; color: white; }
    .auth-link { color: #1a6b4a; font-weight: 600; text-decoration: none; }
    .auth-link:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  submitted = false;
  showPass = false;
  returnUrl = '/';

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin() {
    this.submitted = true;
    if (!this.email || !this.password) return;
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.toast.success(`Welcome back, ${res.user.name}!`);
        this.router.navigate([res.user.role === 'admin' ? '/admin/dashboard' : '/volunteer/dashboard']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Login failed. Please try again.');
        this.loading = false;
      }
    });
  }

  loginAs(role: string) {
    this.email = role === 'admin' ? 'admin@nayepankh.org' : 'volunteer@nayepankh.org';
    this.password = 'demo123456';
    this.onLogin();
  }
}
