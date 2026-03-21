import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface Gym {
  id?: string | number;
  name: string;
  id_owner?: string | number; // Backend key
  email?: string;
  phone?: string;
  adress?: string; // Backend key (typo in backend)
  description?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class GymProfileService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Fetches all gyms from the backend.
   */
  getAllGyms(): Observable<Gym[]> {
    // Modify URL if your backend endpoint naturally implies /gyms
    return this.http.get<Gym[]>(`${this.apiUrl}/gyms`);
  }

  /**
   * Updates a specific gym.
   */
  updateGym(gymId: string | number, data: Partial<Gym>): Observable<Gym> {
    return this.http.put<Gym>(`${this.apiUrl}/gyms/${gymId}`, data);
  }
}
