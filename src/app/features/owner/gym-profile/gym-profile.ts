import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GymProfileService, Gym } from './services/gym-profile.service';
import { GymProfileHeaderComponent } from './components/header/gym-profile-header.component';
import { GymProfileFormComponent } from './components/form/gym-profile-form.component';

import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-gym-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GymProfileHeaderComponent,
    GymProfileFormComponent
  ],
  templateUrl: './gym-profile.html',
  styleUrl: './gym-profile.scss',
})
export class GymProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private gymService = inject(GymProfileService);


  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  loadError = signal<string | null>(null);

  currentGymId = signal<string | number | null>(null);

  gymForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    description: [''],
  });

  ngOnInit() {
    this.fetchOwnerGym();
  }

  fetchOwnerGym() {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.gymService.getAllGyms()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: any) => {
          // Structure based on backend: { success, data: Array(1), message }
          const myGym = Array.isArray(response.data) ? response.data[0] : response.data;

          if (myGym) {
            // Backend uses id_gym as the primary key
            this.currentGymId.set(myGym.id_gym || null);

            this.gymForm.patchValue({
              name: myGym.name || '',
              // Contact email is often in owner object if not in root
              email: myGym.email || myGym.owner?.email || '',
              phone: myGym.phone || '',
              // Backend has a typo (adress with one 'd')
              address: myGym.adress || myGym.address || '',
              description: myGym.description || ''
            });
          } else {
            this.loadError.set('No gym profile found assigned to your account.');
          }
        },
        error: (err) => {
          console.error('Fetch Error:', err);
          this.loadError.set('Unable to load gym profile.');
        }
      });
  }

  toggleEdit() {
    this.isEditing.update(v => !v);
  }

  saveProfile() {
    const targetId = this.currentGymId();
    if (this.gymForm.invalid || !targetId) return;

    this.isSaving.set(true);
    const rawValue = this.gymForm.getRawValue();

    // Map the form data back to the server's expected keys (e.g., adress)
    const payload = {
      ...rawValue,
      adress: rawValue.address, // Mapping back to backend typo
    } as Partial<Gym>;

    this.gymService.updateGym(targetId, payload)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.isEditing.set(false);
          // Future: Toast Notification for successful save
        },
        error: (err) => {
          console.error('Failed to update gym:', err);
          alert('Failed to save changes to backend. Please check your connection.');
        }
      });
  }
}
