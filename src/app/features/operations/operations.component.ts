import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mx-auto max-w-5xl px-4 py-16">
      
      <!-- Premium Mesh Background Simulation -->
      <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div class="absolute -top-20 -left-20 w-96 h-96 bg-fuchsia-500/10 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
         <div class="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full mix-blend-multiply blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div class="relative z-20 text-center max-w-2xl px-6 py-12 bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-2xl">
         <div class="w-24 h-24 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-3xl mx-auto flex items-center justify-center shadow-inner mb-8 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
            <mat-icon class="text-slate-400 dark:text-slate-400 scale-[2.5] block m-0 p-0">lock_outline</mat-icon>
         </div>
         
         <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Access Restricted by Policy</h1>
         <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            The operational modules: Gyms, Courses, Sessions, Attendances, Events, Orders, Payments, Subscriptions, and Enrollments reside outside the scope of Super Admin governance.
         </p>
         
         <div class="bg-blue-50/50 dark:bg-blue-500/10 rounded-2xl p-6 text-left border border-blue-100 dark:border-blue-500/20 mb-8">
            <div class="flex items-center gap-3 mb-2">
               <mat-icon class="text-blue-500">info</mat-icon>
               <h4 class="font-bold text-blue-900 dark:text-blue-100 text-sm">Design Philosophy</h4>
            </div>
            <p class="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
               In the primary backend architecture, a Super Admin operates at a macro level (tenant onboarding, global catalog visibility, system health). The daily operations logic requires an "Owner", "Receptionist", or "Trainer" context and an authenticated Gym relation. If backend capabilities matrix expands, these dynamic shells will activate.
            </p>
         </div>

         <div class="flex justify-center flex-wrap gap-4">
            <button mat-flat-button routerLink="/access-matrix" class="!bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 !px-8 !py-6 !font-bold !rounded-xl hover:scale-105 transition-transform">
               View Access Matrix
            </button>
            <button mat-button routerLink="/dashboard" class="!px-8 !py-6 !font-bold !rounded-xl !text-slate-600 dark:!text-slate-300 hover:!bg-slate-100 dark:hover:!bg-slate-800">
               Return to Dashboard
            </button>
         </div>
      </div>
    </div>
  `
})
export class OperationsComponent { }
