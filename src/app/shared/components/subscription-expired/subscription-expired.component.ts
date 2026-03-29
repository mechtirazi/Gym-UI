import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-subscription-expired',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden">
      <!-- Backdrop with Glassmorphism -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-xl"></div>

      <!-- Content Container -->
      <div class="relative z-10 w-full max-w-xl p-8 mx-4 bg-[#1a1c1e]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl ring-1 ring-white/20">
        <div class="text-center">
          <!-- Pulsing Icon -->
          <div class="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-red-500/10 ring-4 ring-red-500/20 animate-pulse">
            <mat-icon class="text-red-500 !text-6xl !w-15 !h-15">shield_lock</mat-icon>
          </div>

          <h1 class="mb-2 text-3xl font-bold tracking-tight text-white capitalize">
            Access Restricted: <span class="text-red-500">Subscription Expired</span>
          </h1>
          
          <p class="mb-8 text-lg text-slate-400">
            Account access was limited on <span class="font-mono text-white">{{ expiryDate | date:'fullDate' }}</span>. 
            Renew your subscription to restore full functionality.
          </p>

          <!-- Action Steps -->
          <div class="space-y-4 text-left">
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 mt-1 text-xs font-bold rounded-full bg-red-500 text-white">1</span>
                <div>
                  <h3 class="font-semibold text-white">Transfer Monthly Fee</h3>
                  <p class="text-sm text-slate-400 mt-1">
                    Send $50 (Basic) or $150 (Pro) to our bank account:
                  </p>
                  <p class="mt-2 font-mono text-sm tracking-wider text-red-400 select-all">
                    TN00 1234 5678 9012 3456 7890
                  </p>
                </div>
              </div>
            </div>

            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-start gap-3">
                <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 mt-1 text-xs font-bold rounded-full bg-red-500 text-white">2</span>
                <div>
                  <h3 class="font-semibold text-white">Upload Transfer Receipt</h3>
                  <p class="text-sm text-slate-400 mt-1">
                    Upload your payment proof (JPG/PNG) for verification.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="mt-8">
            <input type="file" #fileInput class="hidden" (change)="onFileSelected($event)" accept="image/*">
            <button mat-flat-button color="primary" class="!py-6 !px-10 !rounded-xl !text-lg !font-bold !bg-red-600 !hover:bg-red-700 !transition-all" (click)="fileInput.click()">
              <mat-icon class="mr-2">upload_file</mat-icon>
              Submit Proof of Payment
            </button>
            <p class="mt-4 text-xs text-slate-500">
              Verification usually takes less than 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SubscriptionExpiredComponent {
  @Input() expiryDate: Date | string = new Date();

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log('File selected:', fileList[0]);
      // Implement upload logic here
    }
  }
}
