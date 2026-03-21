import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService, StaffMember } from './services/staff.service';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffManagementComponent implements OnInit {
  private staffService = inject(StaffService);

  staffMembers = signal<StaffMember[]>([]);
  searchQuery = signal<string>('');
  selectedRole = signal<string>('All');
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    // Re-fetch change with debounce
    toObservable(this.searchQuery).pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => this.triggerRefresh());

    toObservable(this.selectedRole).subscribe(() => this.triggerRefresh());
  }

  ngOnInit() { }

  triggerRefresh() {
    this.refreshStaff(this.selectedRole(), this.searchQuery());
  }

  refreshStaff(role?: string, query?: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.staffService.getStaff(role, query)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: any) => {
          console.log('Backend Response:', response);

          // SMART MAPPING: Handles both list of relationships and direct user arrays
          let staffItems: any[] = [];
          
          if (response && response.data) {
            if (Array.isArray(response.data.user)) {
               // Case: { data: { user: [ ... ] } }
               staffItems = response.data.user;
            } else if (Array.isArray(response.data)) {
               // Case: { data: [ ... staff relationships ... ] }
               staffItems = response.data;
            }
          }

          const team = staffItems.map((item: any) => {
            // Check if user is nested (Relationship model) or flat
            const u = item.user || item; 
            
            return {
              id: item.id_gym_staff || u.id_user || item.id,
              name: u.name && u.last_name ? `${u.name} ${u.last_name}` : (u.name || 'Personnel'),
              role: u.role || 'Staff',
              email: u.email || 'N/A',
              phone: u.phone || 'No phone',
              status: item.status || 'Active',
              joinedAt: item.created_at || u.created_at || new Date().toISOString()
            };
          });

          this.staffMembers.set(team);
        },
        error: (err) => {
          console.error('Staff loading failed:', err);
          if (err.status === 401) {
            this.error.set('Unauthorized session. Please re-login.');
          } else {
            this.error.set('Could not fetch the staff list. Check your connection.');
          }
        }
      });
  }

  onRoleChange(role: string) {
    this.selectedRole.set(role);
  }

  deleteStaffMember(id: string) {
    if (!id) return;
    if (confirm('Permanently remove this staff member?')) {
      this.staffService.deleteStaff(id).subscribe({
        next: () => this.triggerRefresh(),
        error: (err) => alert('Operation failed. Check permissions.')
      });
    }
  }
}
