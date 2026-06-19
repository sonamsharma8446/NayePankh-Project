import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<Toast>();
  public toasts$ = this.toastSubject.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration = 4000) {
    const id = Date.now().toString();
    this.toastSubject.next({ id, message, type, duration });
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error'); }
  warning(message: string) { this.show(message, 'warning'); }
  info(message: string) { this.show(message, 'info'); }
}
