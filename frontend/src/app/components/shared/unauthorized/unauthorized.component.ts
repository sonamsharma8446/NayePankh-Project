import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container d-flex flex-column align-items-center justify-content-center" style="min-height:80vh">
      <div class="text-center">
        <div style="font-size:6rem">🚫</div>
        <h1 class="mt-3" style="color:#1a6b4a">Access Denied</h1>
        <p class="text-muted">You don't have permission to access this page.</p>
        <a routerLink="/" class="btn btn-np mt-3">Go Home</a>
      </div>
    </div>
  `,
  styles: [`.btn-np { background:#1a6b4a; color:#fff; padding: 10px 28px; border-radius:8px; }`]
})
export class UnauthorizedComponent {}
