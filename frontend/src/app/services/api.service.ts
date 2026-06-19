import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- Volunteers ---
  createVolunteer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/volunteers`, data);
  }

  getAllVolunteers(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k]) httpParams = httpParams.set(k, params[k]);
      });
    }
    return this.http.get(`${this.apiUrl}/volunteers`, { params: httpParams });
  }

  getMyVolunteerProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/volunteers/me`);
  }

  getVolunteerById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/volunteers/${id}`);
  }

  updateVolunteer(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/volunteers/${id}`, data);
  }

  deleteVolunteer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/volunteers/${id}`);
  }

  // --- Internships ---
  getAllInternships(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== '') httpParams = httpParams.set(k, params[k]);
      });
    }
    return this.http.get(`${this.apiUrl}/internships`, { params: httpParams });
  }

  getInternshipById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/internships/${id}`);
  }

  createInternship(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/internships`, data);
  }

  updateInternship(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/internships/${id}`, data);
  }

  deleteInternship(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/internships/${id}`);
  }

  // --- Applications ---
  applyInternship(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/applications/apply`, data);
  }

  getMyApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/my`);
  }

  getAllApplications(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k]) httpParams = httpParams.set(k, params[k]);
      });
    }
    return this.http.get(`${this.apiUrl}/applications`, { params: httpParams });
  }

  updateApplicationStatus(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/${id}/status`, data);
  }

  // --- Certificates ---
  requestCertificate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/certificates/request`, data);
  }

  getMyCertificates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/certificates/my`);
  }

  getAllCertificates(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k]) httpParams = httpParams.set(k, params[k]);
      });
    }
    return this.http.get(`${this.apiUrl}/certificates`, { params: httpParams });
  }

  approveCertificate(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/certificates/${id}/approve`, data);
  }

  rejectCertificate(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/certificates/${id}/reject`, data);
  }

  // --- Announcements ---
  getAllAnnouncements(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k]) httpParams = httpParams.set(k, params[k]);
      });
    }
    return this.http.get(`${this.apiUrl}/announcements`, { params: httpParams });
  }

  createAnnouncement(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/announcements`, data);
  }

  updateAnnouncement(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/announcements/${id}`, data);
  }

  deleteAnnouncement(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/announcements/${id}`);
  }

  // --- Dashboard ---
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }

  // --- Recommendations ---
  getRecommendation(skills: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommendations`, { skills });
  }
}
