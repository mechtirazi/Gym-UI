import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="bg-white dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-200 cursor-pointer dark:border-slate-700/50 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      
      <!-- Hover gradient bloom -->
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br transition-opacity duration-300 opacity-0 group-hover:opacity-100 blur-[50px] mix-blend-multiply dark:mix-blend-screen rounded-full"
           [ngClass]="colorClass()"></div>
           
      <div class="relative z-10 flex justify-between items-start mb-4">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110"
             [ngClass]="iconContainerClass()">
          <mat-icon [ngClass]="iconColor()" class="!text-2xl">{{icon}}</mat-icon>
        </div>
        <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold truncate max-w-[100px]"
             [ngClass]="trendClass()" *ngIf="trend">
          <mat-icon class="!text-[14px] !w-[14px] !h-[14px]">{{trendIcon()}}</mat-icon>
          {{trend}}%
        </div>
      </div>
      
      <div class="relative z-10 flex flex-col gap-1">
        <span class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{title}}</span>
        <div class="flex items-baseline gap-2">
           <span *ngIf="!loading" class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{value}}</span>
           <mat-spinner *ngIf="loading" diameter="24"></mat-spinner>
           <span *ngIf="subtitle && !loading" class="text-sm font-medium text-slate-400 dark:text-slate-500">{{subtitle}}</span>
        </div>
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() title = '';
  @Input() value: number | string = 0;
  @Input() subtitle = '';
  @Input() icon = 'show_chart';
  @Input() color: 'blue' | 'emerald' | 'rose' | 'amber' | 'purple' = 'blue';
  @Input() trend?: number;
  @Input() loading = false;

  colorClass() {
    return {
      'from-blue-400/30 to-indigo-500/30': this.color === 'blue',
      'from-emerald-400/30 to-teal-500/30': this.color === 'emerald',
      'from-rose-400/30 to-pink-500/30': this.color === 'rose',
      'from-amber-400/30 to-orange-500/30': this.color === 'amber',
      'from-purple-400/30 to-fuchsia-500/30': this.color === 'purple'
    };
  }

  iconContainerClass() {
    return {
      'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20': this.color === 'blue',
      'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20': this.color === 'emerald',
      'bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20': this.color === 'rose',
      'bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20': this.color === 'amber',
      'bg-purple-50 border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20': this.color === 'purple'
    };
  }

  iconColor() {
    return {
      'text-blue-600 dark:text-blue-400': this.color === 'blue',
      'text-emerald-600 dark:text-emerald-400': this.color === 'emerald',
      'text-rose-600 dark:text-rose-400': this.color === 'rose',
      'text-amber-600 dark:text-amber-400': this.color === 'amber',
      'text-purple-600 dark:text-purple-400': this.color === 'purple'
    };
  }

  trendClass() {
    if (!this.trend) return '';
    return this.trend > 0 
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
      : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400';
  }

  trendIcon() {
    if (!this.trend) return '';
    return this.trend > 0 ? 'trending_up' : 'trending_down';
  }
}
