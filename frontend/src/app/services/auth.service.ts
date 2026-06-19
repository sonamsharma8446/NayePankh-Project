import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User, AuthResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => this.setSession(res))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem('np_token');
    localStorage.removeItem('np_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  private setSession(res: AuthResponse) {
    if (res.success && res.token) {
      localStorage.setItem('np_token', res.token);
      localStorage.setItem('np_user', JSON.stringify(res.user));
      this.currentUserSubject.next(res.user);
    }
  }

  private getStoredUser(): User | null {
    try {
      const user = localStorage.getItem('np_user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem('np_token');
  }

  get isLoggedIn(): boolean {
    return !!this.token && !!this.currentUser;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get isVolunteer(): boolean {
    return this.currentUser?.role === 'volunteer';
  }
}
