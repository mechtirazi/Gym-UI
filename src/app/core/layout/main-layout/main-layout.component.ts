import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarNavComponent } from '../../../shared/layout/sidebar-nav/sidebar-nav.component';
import { TopbarComponent } from '../../../shared/layout/topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarNavComponent,
    TopbarComponent
  ],
  template: `
    <div class="main-layout flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      <!-- App Sidebar (Sticky) -->
      <aside class="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-30">
        <app-sidebar-nav></app-sidebar-nav>
      </aside>

      <!-- Main Content Area -->
      <div class="flex flex-col flex-grow min-w-0">
        
        <!-- App Header (Sticky) -->
        <header class="h-16 flex-shrink-0 z-40">
          <app-topbar></app-topbar>
        </header>

        <!-- Router Outlet Container with Scroll Management -->
        <main class="router-outlet-container flex-grow p-6 sm:p-8 lg:p-10 w-full max-w-screen-2xl mx-auto relative overflow-y-auto">
          
          <!-- Glassmorphic background blur effects -->
          <div class="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
          <div class="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>
          <div class="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 pointer-events-none"></div>
          
          <div class="relative z-10 w-full">
            <router-outlet></router-outlet>
          </div>
        </main>

      </div>
    </div>
  `,
  styles: [`
    .router-outlet-container {
      /* Scroll management constraint as requested */
      height: calc(100vh - 64px); 
      overflow-y: auto;
    }
  `]
})
export class MainLayoutComponent {}
