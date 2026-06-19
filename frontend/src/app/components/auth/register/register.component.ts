import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="auth-logo">🌱</div>
            <h2>Join NayePankh</h2>
            <p class="text-muted">Start your volunteering journey today</p>
          </div>

          <form (ngSubmit)="onRegister()" #regForm="ngForm">
            <div class="mb-3">
              <label class="form-label fw-600">Full Name</label>
              <div class="input-group-np">
                <i class="bi bi-person input-icon"></i>
                <input type="text" class="form-control form-control-np" placeholder="Your full name"
                  [(ngModel)]="formData.name" name="name" required [class.is-invalid]="submitted && !formData.name">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-600">Email Address</label>
              <div class="input-group-np">
                <i class="bi bi-envelope input-icon"></i>
                <input type="email" class="form-control form-control-np" placeholder="your@email.com"
                  [(ngModel)]="formData.email" name="email" required [class.is-invalid]="submitted && !formData.email">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-600">Phone Number</label>
              <div class="input-group-np">
                <i class="bi bi-phone input-icon"></i>
                <input type="tel" class="form-control form-control-np" placeholder="+91 XXXXXXXXXX"
                  [(ngModel)]="formData.phone" name="phone">
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-600">Password</label>
              <div class="input-group-np">
                <i class="bi bi-lock input-icon"></i>
                <input [type]="showPass ? 'text' : 'password'" class="form-control form-control-np"
                  placeholder="Minimum 6 characters" [(ngModel)]="formData.password" name="password" required minlength="6"
                  [class.is-invalid]="submitted && formData.password.length < 6">
                <i class="bi input-icon-end" [class.bi-eye]="!showPass" [class.bi-eye-slash]="showPass"
                   (click)="showPass = !showPass" style="cursor:pointer"></i>
              </div>
            </div>

            <div class="terms-check mb-4">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="terms" [(ngModel)]="agreed" name="agreed">
                <label class="form-check-label text-muted small" for="terms">
                  I agree to the <a href="#" class="auth-link">Terms of Service</a> and <a href="#" class="auth-link">Privacy Policy</a>
                </label>
              </div>
            </div>

            <button type="submit" class="btn btn-auth w-100" [disabled]="loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{loading ? 'Creating Account...' : 'Create Account'}}
            </button>
          </form>

          <div *ngIf="submitted && (!formData.name || !formData.email || formData.password.length < 6 || !agreed)" class="mt-3">
            <div *ngIf="submitted && !formData.name" class="text-danger small">Please enter your full name.</div>
            <div *ngIf="submitted && !formData.email" class="text-danger small">Please enter a valid email.</div>
            <div *ngIf="submitted && formData.password.length < 6" class="text-danger small">Password must be at least 6 characters.</div>
            <div *ngIf="submitted && !agreed" class="text-danger small">You must agree to the Terms of Service and Privacy Policy.</div>
          </div>

          <p class="text-center mt-4 text-muted">
            Already have an account? <a routerLink="/login" class="auth-link">Sign in</a>
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
    .auth-link { color: #1a6b4a; font-weight: 600; text-decoration: none; }
    .auth-link:hover { text-decoration: underline; }
    .form-check-input:checked { background-color: #1a6b4a; border-color: #1a6b4a; }
  `]
})
export class RegisterComponent {
  formData = { name: '', email: '', phone: '', password: '' };
  loading = false;
  submitted = false;
  agreed = false;
  showPass = false;

  constructor(
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  onRegister() {
    this.submitted = true;
    console.log('register clicked', this.formData, 'agreed=', this.agreed);
    // validate and show friendly messages
    if (!this.formData.name) {
      this.toast.error('Please enter your full name');
      return;
    }
    if (!this.formData.email) {
      this.toast.error('Please enter a valid email');
      return;
    }
    if (this.formData.password.length < 6) {
      this.toast.error('Password must be at least 6 characters');
      return;
    }
    if (!this.agreed) {
      this.toast.error('You must agree to the Terms and Privacy Policy');
      return;
    }

    this.loading = true;

    this.authService.register(this.formData).subscribe({
      next: (res) => {
        this.toast.success(`Welcome to NayePankh, ${res.user.name}! 🎉`);
        this.router.navigate(['/volunteer/dashboard']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Registration failed');
        this.loading = false;
      }
    });
  }
}
