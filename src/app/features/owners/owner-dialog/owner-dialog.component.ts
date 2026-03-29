import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AdminOwnersService } from '../../../core/services/admin-owners.service';
import { OwnerCreatePayload, OwnerUpdatePayload, UserVm } from '../../../core/models/api.models';

@Component({
  selector: 'app-owner-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, 
    MatInputModule, MatIconModule, MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <div class="p-6 relative">
       <!-- Decoration -->
       <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
       
       <h2 mat-dialog-title class="!m-0 !pl-0 !pt-0 text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-white mb-2">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center">
             <mat-icon>{{data.user ? 'manage_accounts' : 'person_add'}}</mat-icon>
          </div>
          {{ data.user ? 'Edit Owner' : 'Add New Owner' }}
       </h2>
       <p class="text-slate-500 text-sm mb-6">{{ data.user ? 'Modify the details of this owner account.' : 'Create a new owner role account with administrative access to gyms.' }}</p>

       <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
          <div *ngIf="errorMessage()" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
             {{ errorMessage() }}
          </div>
       
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div class="flex flex-col gap-1">
               <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
               <input formControlName="name" type="text" placeholder="John"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
             </div>
             <div class="flex flex-col gap-1">
               <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
               <input formControlName="last_name" type="text" placeholder="Doe"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
             </div>
          </div>

          <div class="flex flex-col gap-1">
             <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
             <input formControlName="email" type="email" placeholder="owner@gym.com"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
          </div>

          <!-- Password only required on creation or optionally on update -->
          <div class="flex flex-col gap-1" *ngIf="!data.user">
             <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Temporary Password</label>
             <input formControlName="password" type="password" placeholder="••••••••"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
             <span class="text-xs text-slate-400 mt-1">Must be at least 8 characters long.</span>
          </div>

          <div class="flex flex-col gap-1">
             <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone (Optional)</label>
             <input formControlName="phone" type="tel" placeholder="+1 234 567 890"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white" />
          </div>

          <mat-dialog-actions align="end" class="!px-0 !pb-0 !pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
             <button mat-button type="button" mat-dialog-close class="!text-slate-500 !font-semibold !rounded-lg" [disabled]="loading()">Cancel</button>
             <button mat-flat-button type="submit" [disabled]="form.invalid || loading()" class="!bg-blue-600 !text-white !font-bold !rounded-lg !px-6 shadow-md shadow-blue-500/20">
                {{ loading() ? 'Saving...' : (data.user ? 'Update Owner' : 'Create Owner') }}
             </button>
          </mat-dialog-actions>
       </form>
    </div>
  `
})
export class OwnerDialogComponent {
  private fb = inject(FormBuilder);
  private ownersService = inject(AdminOwnersService);
  private dialogRef = inject(MatDialogRef<OwnerDialogComponent>);
  
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''], // dynamically validated
    phone: ['']
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user?: UserVm }
  ) {
    if (this.data.user) {
       this.form.patchValue({
         name: this.data.user.name,
         last_name: this.data.user.last_name,
         email: this.data.user.email,
         phone: this.data.user.phone || ''
       });
       this.form.get('password')?.disable();
    } else {
       this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    const isUpdate = !!this.data.user;
    const payload = this.form.value;
    const obs = isUpdate
      ? this.ownersService.updateOwner(this.data.user!.id_user, payload as OwnerUpdatePayload)
      : this.ownersService.createOwner(payload as OwnerCreatePayload);

    obs.subscribe({
      next: (res) => {
        this.loading.set(false);
        this.dialogRef.close(true); // Return success
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 422) {
           this.errorMessage.set(Object.values(err.error?.errors || {}).flat().join('\n') || 'Validation failed');
        } else {
           this.errorMessage.set(err.error?.message || 'Unexpected error occurred.');
        }
      }
    });
  }
}
