import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface StaffMember {
  id?: string;
  id_staff?: string;
  name?: string;
  name_staff?: string; // Fallback for backend key
  role?: string;
  email?: string;
  phone?: string;
  status?: string;
  avatar?: string;
  joinedAt?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Fetches all staff members from the real backend.
   * Server-side filtering & Token implementation.
   */
  getStaff(role?: string, query?: string): Observable<any> {
    const url = `${this.apiUrl}/gym-staff`;
    
    // Explicit token retrieval for robustness
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params: any = {};
    if (role && role !== 'All') params.role = role;
    if (query) params.search = query;

    return this.http.get<any>(url, { headers, params });
  }

  addStaff(member: Partial<StaffMember>): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post<any>(`${this.apiUrl}/gym-staff`, member, { headers });
  }

  updateStaff(id: string, member: Partial<StaffMember>): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.put<any>(`${this.apiUrl}/gym-staff/${id}`, member, { headers });
  }

  deleteStaff(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/gym-staff/${id}`, { headers });
  }
}
