import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarNavComponent } from '../sidebar-nav/sidebar-nav.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    SidebarNavComponent,
    TopbarComponent
  ],
  template: `
    <mat-sidenav-container class="h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300" autosize>
      <mat-sidenav 
        #sidenav 
        mode="side" 
        [opened]="true" 
        [disableClose]="true"
        fixedInViewport="true"
        fixedTopGap="0"
        class="!w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <app-sidebar-nav></app-sidebar-nav>
      </mat-sidenav>
      <mat-sidenav-content class="flex flex-col relative overflow-y-auto w-full h-full">
        <app-topbar></app-topbar>
        <main class="flex-grow p-6 sm:p-8 lg:p-10 w-full max-w-screen-2xl mx-auto overflow-x-hidden relative">
          <!-- Glassmorphic background blur effects -->
          <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div class="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div class="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          
          <div class="relative z-10 w-full">
            <router-outlet></router-outlet>
          </div>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
    }
    ::ng-deep .mdc-drawer {
      width: 256px !important;
    }
    ::ng-deep .mat-drawer-inner-container {
      overflow-x: hidden;
    }
  `]
})
export class AppShellComponent { }
