import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from '../../core/services/notifications.service';
import { AdminOwnersService } from '../../core/services/admin-owners.service';
import { NotificationDto, UserVm } from '../../core/models/api.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatSnackBarModule],
  template: `
    <div class="mb-8 flex justify-between items-start">
      <div>
         <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Platform Notifications</h1>
         <p class="text-sm text-slate-500 dark:text-slate-400">System alerts and administrative messaging hub.</p>
      </div>
    </div>

    <!-- Administrative Alerts Section -->
    <div class="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        <!-- Broadcast Form -->
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl transition-all duration-500"></div>
          <div class="flex items-center gap-4 mb-6 relative z-10">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-blue-100 dark:border-blue-800">
              <mat-icon>campaign</mat-icon>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white leading-none">Broadcast Board</h3>
              <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Global announcement</p>
            </div>
          </div>
          
          <form [formGroup]="broadcastForm" (ngSubmit)="sendBroadcast()" class="space-y-4 relative z-10">
            <textarea 
              formControlName="message"
              placeholder="Type your system-wide announcement here..."
              class="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all outline-none text-slate-700 dark:text-slate-200 font-medium placeholder:text-slate-400"
            ></textarea>
            <button 
              type="submit" 
              [disabled]="broadcastForm.invalid || broadcasting()"
              class="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-2xl font-black transition-all disabled:opacity-50 shadow-xl shadow-slate-900/10 dark:shadow-blue-900/20"
            >
              <mat-icon *ngIf="!broadcasting()">send</mat-icon>
              <mat-icon *ngIf="broadcasting()" class="animate-spin text-sm">refresh</mat-icon>
              <span>{{ broadcasting() ? 'Broadcasting...' : 'Broadcast to All' }}</span>
            </button>
          </form>
        </div>

        <!-- Targeted Alert Form -->
        <div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div class="absolute -top-12 -right-12 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl transition-all duration-500"></div>
          <div class="flex items-center gap-4 mb-6 relative z-10">
            <div class="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800">
              <mat-icon>notification_important</mat-icon>
            </div>
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white leading-none">Targeted Alert</h3>
              <p class="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Direct to gym owner</p>
            </div>
          </div>
          
          <form [formGroup]="targetedForm" (ngSubmit)="sendTargeted()" class="space-y-4 relative z-10">
            <select 
              formControlName="ownerId"
              class="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-300 transition-all outline-none text-slate-700 dark:text-slate-200 font-bold"
            >
              <option value="" disabled selected>Select an Owner</option>
              <option *ngFor="let o of owners()" [value]="o.id_user">{{ o.name }} {{ o.last_name }}</option>
            </select>
            <textarea 
              formControlName="message"
              placeholder="Type your direct alert..."
              class="w-full h-16 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-300 transition-all outline-none text-slate-700 dark:text-slate-200 font-medium placeholder:text-slate-400"
            ></textarea>
            <button 
              type="submit" 
              [disabled]="targetedForm.invalid || sendingTargeted()"
              class="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/20"
            >
              <mat-icon *ngIf="!sendingTargeted()">mail</mat-icon>
              <mat-icon *ngIf="sendingTargeted()" class="animate-spin text-sm">refresh</mat-icon>
              <span>{{ sendingTargeted() ? 'Sending...' : 'Send Direct Alert' }}</span>
            </button>
          </form>
        </div>
    </div>

    <div class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm max-w-4xl">
       <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Alerts</h2>
       <!-- Loading -->
       <div *ngIf="loading()" class="flex items-center justify-center py-16">
          <div class="flex flex-col items-center gap-4">
             <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
             <span class="text-sm text-slate-500 font-medium">Loading notifications…</span>
          </div>
       </div>

       <!-- Error State -->
       <div *ngIf="!loading() && errorMsg()" class="flex items-center gap-4 p-4 rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20">
          <mat-icon class="text-red-500">error</mat-icon>
          <span class="text-sm text-red-700 dark:text-red-300">{{ errorMsg() }}</span>
       </div>

       <!-- Notifications List -->
       <ng-container *ngIf="!loading() && !errorMsg()">
          <div *ngFor="let n of notifications()" class="flex items-center gap-4 p-4 mb-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
             <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <mat-icon>mail</mat-icon>
             </div>
              <div class="flex flex-col flex-grow min-w-0">
                <div class="flex justify-between w-full mb-1">
                   <div class="flex flex-col">
                      <span class="text-base font-bold text-slate-900 dark:text-white truncate">{{ n.text }}</span>
                      <span *ngIf="!n.recipient_id" class="text-[10px] font-black uppercase tracking-tighter text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md inline-block w-max mt-1">System Announcement</span>
                   </div>
                   <span class="text-xs font-semibold text-slate-400 shrink-0 ml-4">{{ n.created_at | date:'short' }}</span>
                </div>
                <span class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">Notification #{{ n.id_notification }}</span>
              </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="notifications().length === 0" class="flex flex-col items-center justify-center py-16">
             <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <mat-icon class="text-slate-300 dark:text-slate-500 scale-150">notifications_off</mat-icon>
             </div>
             <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No Notifications</h4>
             <p class="text-sm text-slate-500 text-center max-w-sm">You don't have any notifications at this time.</p>
          </div>
       </ng-container>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
  private notificationsService = inject(NotificationsService);
  private ownersService = inject(AdminOwnersService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  notifications = signal<NotificationDto[]>([]);
  errorMsg = signal<string | null>(null);
  owners = signal<UserVm[]>([]);

  broadcasting = signal(false);
  sendingTargeted = signal(false);

  broadcastForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  targetedForm = this.fb.group({
    ownerId: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  ngOnInit() {
    this.refreshData();
    this.ownersService.getOwners().subscribe(data => this.owners.set(data));
  }

  refreshData() {
    this.loading.set(true);
    this.notificationsService.getNotifications().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Failed to load notifications.');
        this.loading.set(false);
      }
    });
  }

  sendBroadcast() {
    if (this.broadcastForm.invalid) return;
    this.broadcasting.set(true);
    this.notificationsService.sendToAllUsers(this.broadcastForm.value.message!).subscribe({
      next: () => {
        this.snackBar.open('Broadcast message sent.', 'Dismiss', { duration: 3000 });
        this.broadcastForm.reset();
        this.broadcasting.set(false);
        this.refreshData();
      },
      error: () => {
        this.snackBar.open('Failed to send broadcast.', 'Dismiss', { duration: 4000 });
        this.broadcasting.set(false);
      }
    });
  }

  sendTargeted() {
    if (this.targetedForm.invalid) return;
    this.sendingTargeted.set(true);
    const { ownerId, message } = this.targetedForm.value;
    this.notificationsService.sendToOwner(ownerId!, message!).subscribe({
      next: () => {
        this.snackBar.open('Direct notification sent.', 'Dismiss', { duration: 3000 });
        this.targetedForm.reset();
        this.sendingTargeted.set(false);
        this.refreshData();
      },
      error: () => {
        this.snackBar.open('Failed to send message.', 'Dismiss', { duration: 4000 });
        this.sendingTargeted.set(false);
      }
    });
  }
}
