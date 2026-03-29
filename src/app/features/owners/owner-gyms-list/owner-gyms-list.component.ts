import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GymDto } from '../../../core/models/api.models';
import { AdminOwnersService } from '../../../core/services/admin-owners.service';
import { AdminGymsService } from '../../../core/services/admin-gyms.service';
import { GymDialogComponent } from '../gym-dialog/gym-dialog.component';
import { SuspendDialogComponent } from '../../gyms/suspend-dialog.component';

@Component({
  selector: 'app-owner-gyms-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './owner-gyms-list.component.html',
  styles: [`
    .nested-container {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
    }
  `]
})
export class OwnerGymsListComponent implements OnInit {
  private _ownerId!: number | string;
  @Input({ required: true }) set ownerId(val: number | string) {
    this._ownerId = val;
    if (this._ownerId) this.fetchGyms();
  }
  get ownerId(): number | string { return this._ownerId; }

  @Input() ownerName!: string;

  private ownersService = inject(AdminOwnersService);
  private adminGymsService = inject(AdminGymsService);
  private dialog = inject(MatDialog);

  gyms = signal<GymDto[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
  }

  fetchGyms() {
    this.loading.set(true);
    this.ownersService.getGymsByOwner(this.ownerId).subscribe({
      next: (data) => {
        this.gyms.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load gyms.');
        this.loading.set(false);
      }
    });
  }

  openAddGymDialog() {
    const dialogRef = this.dialog.open(GymDialogComponent, {
      width: '500px',
      data: { ownerId: this.ownerId, ownerName: this.ownerName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the local array / observable automatically without full page reload
        this.fetchGyms();
      }
    });
  }

  openSuspendDialog(gym: GymDto) {
    const dialogRef = this.dialog.open(SuspendDialogComponent, {
      width: '480px',
      data: { gymName: gym.name }
    });

    dialogRef.afterClosed().subscribe((reason: string) => {
      if (reason) {
        this.loading.set(true);
        this.adminGymsService.suspendGym(gym.id_gym, reason).subscribe({
          next: () => {
            this.fetchGyms();
          },
          error: () => this.loading.set(false)
        });
      }
    });
  }

  activateGym(gym: GymDto) {
    this.loading.set(true);
    this.adminGymsService.activateGym(gym.id_gym).subscribe({
      next: () => {
        this.fetchGyms();
      },
      error: () => this.loading.set(false)
    });
  }

  trackByGymId = (_: number, gym: GymDto) => gym.id_gym;
}
