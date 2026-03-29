import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, of, forkJoin, retry } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { CapabilityService } from '../../core/services/capability.service';

interface EndpointProbe {
  name: string;
  path: string;
  status: 'checking' | 'accessible' | 'forbidden' | 'not_exposed' | 'unstable';
  detail?: string;
}

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="mb-8 flex justify-between items-start">
      <div>
         <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">Systems & Monitoring</h1>
         <p class="text-sm text-slate-500 dark:text-slate-400">Endpoint probes, connectivity checks, and operational status.</p>
      </div>
      <button (click)="runProbes()" class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2">
        <mat-icon [class.animate-spin]="anyChecking()" class="!text-[18px] !w-[18px] !h-[18px]">refresh</mat-icon>
        Re-run Probes
      </button>
    </div>
    
    <div class="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-slate-700 shadow-sm max-w-5xl">
       <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-slate-700">
          <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100">API Integration Board</h2>
          <span class="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border"
                [ngClass]="overallStatusClass()">{{ overallStatus() }}</span>
       </div>
       
       <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div *ngFor="let ep of endpoints()" class="flex items-center justify-between" 
               [class.bg-amber-50/50]="ep.status === 'unstable'"
               [class.dark:bg-amber-900/10]="ep.status === 'unstable'"
               [class.-mx-4]="ep.status === 'unstable'"
               [class.px-4]="ep.status === 'unstable'"
               [class.py-2]="ep.status === 'unstable'"
               [class.rounded-xl]="ep.status === 'unstable'">
             <div class="flex items-center gap-3">
                <mat-icon [ngClass]="getProbeIconClass(ep.status)">{{ getProbeIcon(ep.status) }}</mat-icon>
                <div class="flex flex-col">
                   <span class="text-sm font-bold text-slate-800 dark:text-white">{{ ep.name }}</span>
                   <span class="text-xs text-slate-400 font-mono mt-0.5">{{ ep.path }}</span>
                </div>
             </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded border"
                    [ngClass]="getStatusBadgeClass(ep.status)">
                {{ ep.status === 'checking' ? 'Checking…' : ep.status === 'accessible' ? 'Accessible' : ep.status === 'forbidden' ? 'Forbidden' : ep.status === 'not_exposed' ? 'Not Exposed' : 'Unstable' }}
              </span>
           </div>
       </div>
    </div>
  `
})
export class MonitoringComponent implements OnInit {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private capabilityService = inject(CapabilityService);

  endpoints = signal<EndpointProbe[]>([
    { name: 'System Health', path: '/up', status: 'checking' },
    { name: 'Core Auth Service', path: '/api/me', status: 'checking' },
    { name: 'Owner Management', path: '/api/users', status: 'checking' },
    { name: 'Notifications', path: '/api/notifications', status: 'checking' },
  ]);

  ngOnInit() {
    this.runProbes();
  }

  anyChecking(): boolean {
    return this.endpoints().some(e => e.status === 'checking');
  }

  overallStatus(): string {
    const eps = this.endpoints();
    if (eps.some(e => e.status === 'checking')) return 'Probing…';
    if (eps.every(e => e.status === 'accessible')) return 'All Systems Normal';
    if (eps.some(e => e.status === 'unstable')) return 'Unstable';
    return 'Partial';
  }

  overallStatusClass() {
    const status = this.overallStatus();
    if (status === 'All Systems Normal') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
    if (status === 'Probing…') return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
    return 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
  }

  private mapError(err: any): 'forbidden' | 'not_exposed' | 'unstable' {
    if (err.status === 401 || err.status === 403) return 'forbidden';
    if (err.status === 404 || err.status === 501) return 'not_exposed';
    return 'unstable';
  }

  runProbes() {
    // Reset all to checking
    this.endpoints.set(this.endpoints().map(e => ({ ...e, status: 'checking' as const })));

    const base = environment.apiBaseUrl;

    // Health check (/up) — no auth needed
    this.http.get(`${base}/up`, { observe: 'response', responseType: 'text' }).pipe(
      retry(2),
      map(() => 'accessible' as const),
      catchError(err => of(this.mapError(err)))
    ).subscribe(status => this.updateEndpoint('/up', status as any));

    // Auth check (/api/me)
    this.http.get<any>(`${base}/api/me`).pipe(
      retry(2),
      map(() => 'accessible' as const),
      catchError(err => of(this.mapError(err)))
    ).subscribe(status => this.updateEndpoint('/api/me', status as any));

    // Users
    this.http.get<any>(`${base}/api/users`).pipe(
      retry(2),
      map(() => 'accessible' as const),
      catchError(err => of(this.mapError(err)))
    ).subscribe(status => this.updateEndpoint('/api/users', status as any));


    // Notifications
    this.http.get<any>(`${base}/api/notifications`).pipe(
      retry(2),
      map(() => 'accessible' as const),
      catchError(err => of(this.mapError(err)))
    ).subscribe(status => this.updateEndpoint('/api/notifications', status as any));
  }

  private updateEndpoint(path: string, status: 'accessible' | 'forbidden' | 'not_exposed' | 'unstable') {
    this.endpoints.set(this.endpoints().map(e =>
      e.path === path ? { ...e, status } : e
    ));

    const isAvailable = status === 'accessible' || status === 'forbidden';
    if (path === '/api/users') {
      this.capabilityService.setEndpointStatus('users.ownerCrud', isAvailable);
    } else if (path === '/api/notifications') {
      this.capabilityService.setEndpointStatus('notifications.self', isAvailable);
    }
  }

  getProbeIcon(status: string): string {
    switch (status) {
      case 'accessible': return 'check_circle';
      case 'forbidden': return 'block';
      case 'not_exposed': return 'construction';
      case 'unstable': return 'warning_amber';
      default: return 'hourglass_empty';
    }
  }

  getProbeIconClass(status: string) {
    switch (status) {
      case 'accessible': return 'text-emerald-500';
      case 'forbidden': return 'text-amber-500';
      case 'not_exposed': return 'text-slate-400';
      case 'unstable': return 'text-red-500';
      default: return 'text-slate-300 animate-pulse';
    }
  }

  getStatusBadgeClass(status: string) {
    switch (status) {
      case 'accessible': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-800';
      case 'forbidden': return 'text-amber-600 bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-800';
      case 'not_exposed': return 'text-slate-500 bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600';
      case 'unstable': return 'text-red-600 bg-red-100 dark:bg-red-500/20 border-red-200 dark:border-red-800';
      default: return 'text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  }
}
