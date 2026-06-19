import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:9999">
      <div *ngFor="let toast of toasts" class="toast show np-toast" [ngClass]="'toast-' + toast.type">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi" [ngClass]="{
            'bi-check-circle-fill': toast.type === 'success',
            'bi-x-circle-fill': toast.type === 'error',
            'bi-exclamation-triangle-fill': toast.type === 'warning',
            'bi-info-circle-fill': toast.type === 'info'
          }"></i>
          <span>{{toast.message}}</span>
          <button class="ms-auto btn-close btn-close-sm" (click)="remove(toast.id)"></button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .np-toast { min-width: 300px; border-radius: 12px; border: none; box-shadow: 0 8px 24px rgba(0,0,0,0.15); margin-bottom: 8px; animation: slideIn 0.3s ease; }
    .toast-success { background: #d4edda; color: #155724; }
    .toast-error { background: #f8d7da; color: #721c24; }
    .toast-warning { background: #fff3cd; color: #856404; }
    .toast-info { background: #d1ecf1; color: #0c5460; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private sub!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.sub = this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.remove(toast.id), toast.duration || 4000);
    });
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}
