import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-access-matrix',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Role & Access Matrix</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">A read-only view of hardcoded backend capacity constraints and domain policies.</p>
    </div>

    <!-- Governance Note -->
    <div class="mb-8 p-6 bg-slate-900 text-white dark:bg-slate-800 border border-slate-800 dark:border-slate-700 rounded-3xl flex gap-6 items-start shadow-2xl relative overflow-hidden">
       <div class="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
       <mat-icon class="text-emerald-400 scale-[2] mt-2 ml-2">policy</mat-icon>
       <div class="flex flex-col z-10">
          <span class="font-black text-xl mb-2 text-white tracking-tight">Governance Structure</span>
          <span class="text-sm text-slate-300 leading-relaxed max-w-3xl">Platform roles are rigorously structured. <strong>Super Admin</strong> handles top-level platform provisioning (creating owner accounts, global monitoring). Tenant boundaries exist such that only <strong>Owners</strong> or <strong>Receptionists</strong> handle deep operational tasks like course scheduling or member attendances.</span>
       </div>
    </div>

    <!-- Matrix grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
       
       <!-- Super Admin -->
       <div class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-lg">
          <div class="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700 mb-6">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                   <mat-icon>admin_panel_settings</mat-icon>
                </div>
                <div>
                   <h3 class="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">Super Admin</h3>
                   <span class="text-xs tracking-widest uppercase font-semibold text-blue-500">Global Observer</span>
                </div>
             </div>
          </div>
          
          <ul class="flex flex-col gap-3">
             <li class="flex items-center gap-3">
                <mat-icon class="text-emerald-500">check_circle</mat-icon>
                <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">User Profile Lifecycle (Owners Only)</span>
             </li>

             <li class="flex items-center gap-3">
                <mat-icon class="text-emerald-500">check_circle</mat-icon>
                <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">System Health Indicators</span>
             </li>
             <li class="flex items-center gap-3 opacity-50">
                <mat-icon class="text-red-500">cancel</mat-icon>
                <span class="text-sm text-slate-700 dark:text-slate-300 line-through">Gym Operations (Sessions, Enrollments)</span>
             </li>
          </ul>
       </div>
       
       <!-- Owner -->
       <div class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition hover:shadow-lg">
          <div class="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700 mb-6">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                   <mat-icon>storefront</mat-icon>
                </div>
                <div>
                   <h3 class="font-bold text-slate-900 dark:text-white text-lg leading-tight mb-1">Gym Owner</h3>
                   <span class="text-xs tracking-widest uppercase font-semibold text-purple-500">Tenant Controller</span>
                </div>
             </div>
          </div>
          
          <ul class="flex flex-col gap-3">
             <li class="flex items-center gap-3">
                <mat-icon class="text-emerald-500">check_circle</mat-icon>
                <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">Manage Tenant Gyms</span>
             </li>
             <li class="flex items-center gap-3">
                <mat-icon class="text-emerald-500">check_circle</mat-icon>
                <span class="text-sm text-slate-700 dark:text-slate-300 font-medium">Full Operations (Courses, Subscriptions)</span>
             </li>

             <li class="flex items-center gap-3 opacity-50">
                <mat-icon class="text-red-500">cancel</mat-icon>
                <span class="text-sm text-slate-700 dark:text-slate-300 line-through">Global User Provisioning</span>
             </li>
          </ul>
       </div>
       
    </div>
  `
})
export class AccessMatrixComponent { }
