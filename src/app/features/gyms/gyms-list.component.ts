import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { AdminGymsService, GymDto } from '../../core/services/admin-gyms.service';
import { SuspendDialogComponent } from './suspend-dialog.component';
import { computed } from '@angular/core';

@Component({
  selector: 'app-gyms-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    FormsModule
  ],
  template: `
    <div class="gyms-container">
      <header class="gyms-header">
        <div class="gyms-copy">
          <div class="gyms-badge">
            <mat-icon>storefront</mat-icon>
            <span>GYM MANAGEMENT</span>
          </div>
          <h1>Platform Gyms</h1>
          <p>Manage gym access, suspend violations, and reactivate accounts.</p>
        </div>
        <button type="button" class="gyms-refresh-btn" (click)="loadGyms()">
          <mat-icon [class.is-spinning]="loading()">refresh</mat-icon>
          Refresh
        </button>
      </header>

      <!-- Loading Skeleton -->
      <div *ngIf="loading()" class="gyms-loading">
        <div class="skeleton-row" *ngFor="let i of [1,2,3,4]"></div>
      </div>

      <!-- Filters -->
      <div class="gyms-filters-row">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <mat-label>Search</mat-label>
          <input
            matInput
            [ngModel]="searchTerm()"
            (ngModelChange)="searchTerm.set($event)"
            placeholder="Search by gym or owner name..."
          >
        </mat-form-field>

        <mat-form-field appearance="outline" class="status-field">
          <mat-label>Status</mat-label>
          <mat-select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <mat-option value="all">All</mat-option>
            <mat-option value="active">Active</mat-option>
            <mat-option value="suspended">Suspended</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Table -->
      <div *ngIf="!loading()" class="gyms-table-wrap">
        <table class="gyms-table" matSort (matSortChange)="activeSort.set($event)">
          <thead>
            <tr>
              <th mat-sort-header="name">Gym Name</th>
              <th>Owner</th>
              <th mat-sort-header="members_count">Members</th>
              <th mat-sort-header="status">Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let gym of filteredGyms()" class="gyms-row">
              <td class="gym-name">{{ gym.name }}</td>
              <td class="gym-owner">{{ gym.owner?.name }}</td>
              <td>{{ gym.members_count || 0 }}</td>
              <td>
                <span class="status-badge" [class.status-badge--active]="gym.status === 'active'" [class.status-badge--suspended]="gym.status === 'suspended'">
                  <span class="status-dot"></span>
                  {{ gym.status }}
                </span>
              </td>
              <td>
                <button
                  *ngIf="gym.status === 'active'"
                  class="action-btn action-btn--suspend"
                  (click)="openSuspendDialog(gym.id_gym)"
                  [disabled]="actionInProgress()"
                >
                  <mat-icon>block</mat-icon>
                  Suspend
                </button>
                <button
                  *ngIf="gym.status === 'suspended'"
                  class="action-btn action-btn--activate"
                  (click)="activateGym(gym)"
                  [disabled]="actionInProgress()"
                >
                  <mat-icon>check_circle</mat-icon>
                  Activate
                </button>
              </td>
            </tr>

            <tr *ngIf="gyms().length === 0">
              <td colspan="5" class="gyms-empty">
                <mat-icon>storefront</mat-icon>
                <span>No gyms found on the platform.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './gyms-list.component.scss'
})
export class GymsListComponent implements OnInit {
  private gymsService = inject(AdminGymsService);
  private dialog = inject(MatDialog);

  gyms = signal<GymDto[]>([]);
  loading = signal(true);
  actionInProgress = signal(false);

  // Search & Filter state
  searchTerm = signal('');
  statusFilter = signal<'all' | 'active' | 'suspended'>('all');
  activeSort = signal<Sort>({ active: '', direction: '' });

  // Computed derived list
  filteredGyms = computed<GymDto[]>(() => {
    const list = this.gyms();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const sort = this.activeSort();

    let result = list.filter(gym => {
      const gName = gym.name.toLowerCase();
      const oName = gym.owner?.name?.toLowerCase() || '';
      
      const matchesSearch = !search || gName.includes(search) || oName.includes(search);
      const matchesStatus = status === 'all' || gym.status === status;
      return matchesSearch && matchesStatus;
    });

    if (sort.active && sort.direction) {
      result = [...result].sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return this.compare(a.name, b.name, isAsc);
          case 'members_count': return this.compare(a.members_count || 0, b.members_count || 0, isAsc);
          case 'status': return this.compare(a.status, b.status, isAsc);
          default: return 0;
        }
      });
    }

    return result;
  });

  private compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnInit() {
    this.loadGyms();
  }

  loadGyms() {
    this.loading.set(true);
    this.gymsService.getGyms().subscribe({
      next: (data) => {
        this.gyms.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openSuspendDialog(id_gym: GymDto['id_gym']) {
    const gym = this.gyms().find(g => g.id_gym === id_gym);
    if (!gym) return;
    const dialogRef = this.dialog.open(SuspendDialogComponent, {
      width: '480px',
      data: { gymName: gym.name }
    });

    dialogRef.afterClosed().subscribe((reason: string) => {
      if (reason) {
        this.actionInProgress.set(true);
        this.gymsService.suspendGym(id_gym, reason).subscribe({
          next: () => {
            this.actionInProgress.set(false);
            this.loadGyms();
          },
          error: () => this.actionInProgress.set(false)
        });
      }
    });
  }

  activateGym(gym: GymDto) {
    this.actionInProgress.set(true);
    this.gymsService.activateGym(gym.id_gym).subscribe({
      next: () => {
        this.actionInProgress.set(false);
        this.loadGyms();
      },
      error: () => this.actionInProgress.set(false)
    });
  }
}
