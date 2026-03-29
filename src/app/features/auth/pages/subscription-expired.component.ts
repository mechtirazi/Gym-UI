import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-subscription-expired',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-[#0f1113]">
      <!-- Animated Background Accents -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>

      <!-- Main Content Container with Glassmorphism -->
      <div class="relative z-10 w-full max-w-2xl px-6 py-12 mx-4 bg-[#1a1c1e]/60 border border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl ring-1 ring-white/10 overflow-hidden">
        
        <!-- Decoration Line -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

        <div class="text-center">
          <!-- Premium Pulsing Icon Wrapper -->
          <div class="relative inline-flex mb-8">
            <div class="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
            <div class="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-red-500/20 to-red-900/40 border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
              <mat-icon class="!text-6xl !w-15 !h-15 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">shield_lock</mat-icon>
            </div>
          </div>

          <h1 class="mb-3 text-4xl font-extrabold tracking-tight text-white/90">
            Access Restricted: <span class="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Subscription Expired</span>
          </h1>
          
          <p class="max-w-md mx-auto mb-10 text-lg text-slate-400 leading-relaxed">
            Your management dashboard has been temporarily locked. Restore access by completing the verification below.
          </p>

          <!-- Action Steps Grid -->
          <div class="grid gap-4 mb-10 text-left md:grid-cols-2">
            <!-- Step 1 -->
            <div class="group p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
              <div class="flex items-center gap-4 mb-3">
                <span class="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-xl bg-red-500/20 text-red-400 border border-red-500/20">1</span>
                <h3 class="font-bold text-white/80">Monthly Fee</h3>
              </div>
              <p class="text-sm text-slate-400 mb-3 leading-snug">
                Transfer <span class="text-white font-medium">$50 (Basic)</span> or <span class="text-white font-medium">$150 (Pro)</span> to our official account:
              </p>
              <div class="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] tracking-tight text-red-400/90 select-all transition-colors group-hover:bg-black/60">
                TN00 1234 5678 9012 3456 7890
              </div>
            </div>

            <!-- Step 2 -->
            <div class="group p-5 rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
              <div class="flex items-center gap-4 mb-3">
                <span class="flex items-center justify-center w-8 h-8 text-sm font-bold rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/20">2</span>
                <h3 class="font-bold text-white/80">Proof of Payment</h3>
              </div>
              <p class="text-sm text-slate-400 mb-4 leading-snug">
                Submit a screenshot or PDF of your bank transfer receipt for instant manual audit.
              </p>
              <div class="flex items-center gap-2 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                <mat-icon class="!text-sm !w-4 !h-4">verified_user</mat-icon>
                Secured Verification
              </div>
            </div>
          </div>

          <!-- Bottom Action Area -->
          <div class="space-y-6">
            <div class="relative group inline-block">
              <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <input type="file" #fileInput class="hidden" (change)="onFileSelected($event)" accept="image/*,application/pdf">
              <button mat-flat-button class="!relative !py-7 !px-12 !rounded-2xl !bg-[#e11d48] !hover:!bg-[#be123c] !text-white !font-black !text-lg !tracking-wide !shadow-2xl !transition-all !duration-300" (click)="fileInput.click()">
                <div class="flex items-center gap-3">
                  <mat-icon class="!w-6 !h-6 !text-2xl">cloud_upload</mat-icon>
                  SUBMIT PROOF OF PAYMENT
                </div>
              </button>
            </div>

            <div class="flex items-center justify-center gap-6">
              <button (click)="logout()" class="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors">
                <mat-icon class="!w-5 !h-5 !text-xl">logout</mat-icon>
                Disconnect Session
              </button>
              <div class="w-px h-4 bg-white/10"></div>
              <p class="text-slate-500 text-sm">
                Need help? <a href="mailto:support@gym.com" class="text-red-400 hover:underline">Contact Support</a>
              </p>
            </div>
          </div>

          <!-- Selected File Indicator (Subtle) -->
          <div *ngIf="selectedFileName()" class="mt-6 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
             <div class="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                <mat-icon class="!text-green-500 !text-sm !w-4 !h-4">check_circle</mat-icon>
                <span class="text-xs text-green-400 font-medium">{{ selectedFileName() }}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #0f1113;
    }
  `]
})
export class SubscriptionExpiredComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  selectedFileName = signal<string | null>(null);

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFileName.set(fileList[0].name);
      // Implement your upload/submission service logic here
      console.log('Payment proof ready for submission:', fileList[0]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
