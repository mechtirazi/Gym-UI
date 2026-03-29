import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-all"
          [ngClass]="getClasses()">
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="getDotClasses()"></span>
      <ng-content></ng-content>
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
  
  getClasses() {
    switch(this.status) {
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case 'error': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
    }
  }

  getDotClasses() {
    switch(this.status) {
      case 'success': return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] dark:bg-emerald-400';
      case 'warning': return 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)] dark:bg-amber-400';
      case 'error': return 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] dark:bg-rose-400';
      case 'info': return 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)] dark:bg-blue-400';
      default: return 'bg-slate-400 dark:bg-slate-500';
    }
  }
}
