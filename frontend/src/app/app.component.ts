import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ToastService, Toast } from './services/toast.service';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { ToastContainerComponent } from './components/shared/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, ToastContainerComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-toast-container></app-toast-container>
  `,
  styles: [`
    main { min-height: calc(100vh - 70px); }
  `]
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {}
  ngOnInit() {}
}
