import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BabyService, BabyContextService } from '../../core/services';
import { Sex } from '../../core/models';

@Component({
  selector: 'app-baby-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <!-- Back -->
    <button (click)="goBack()" class="touch-bounce"
            style="display: flex; align-items: center; gap: 4px; font-size: 15px; font-weight: 600; color: #8B5CF6; background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 20px; font-family: 'Nunito Sans', sans-serif;">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Înapoi
    </button>

    <h1 class="font-heading" style="font-size: 22px; font-weight: 800; color: #3B2E26; margin: 0 0 24px;">
      {{ isEdit() ? 'Editează bebeluș' : 'Bebeluș nou' }}
    </h1>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- Name -->
      <div class="section-label">Nume</div>
      <input formControlName="name" class="luna-input" placeholder="ex: Sofia" autocomplete="off" style="margin-bottom: 16px;" />

      <!-- Date of birth -->
      <div class="section-label">Data nașterii</div>
      <input formControlName="dateOfBirth" type="date" class="luna-input" style="margin-bottom: 16px;" />

      <!-- Sex selector -->
      <div class="section-label">Sex</div>
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        @for (option of sexOptions; track option.value) {
          <button type="button" class="source-pill" style="flex: 1; text-align: center;"
                  [class.source-pill--active]="form.get('sex')!.value === option.value"
                  (click)="form.get('sex')!.setValue(option.value)">
            {{ option.label }}
          </button>
        }
      </div>

      <!-- Notes -->
      <div class="section-label">Note</div>
      <textarea formControlName="notes" class="luna-input" rows="3" placeholder="Opțional..." style="resize: none; margin-bottom: 24px;"></textarea>

      <!-- Submit -->
      <button type="submit" class="btn-primary" style="width: 100%;" [disabled]="form.invalid || submitting()">
        @if (submitting()) {
          <span style="display: inline-flex; align-items: center; gap: 8px;">
            <span style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;"></span>
            Se salvează...
          </span>
        } @else {
          {{ isEdit() ? 'Salvează modificările' : 'Adaugă bebeluș' }}
        }
      </button>
    </form>
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BabyFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly babyService = inject(BabyService);
  private readonly babyCtx = inject(BabyContextService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEdit = signal(false);
  submitting = signal(false);
  private editId = '';

  sexOptions: { value: Sex; label: string }[] = [
    { value: 'Male', label: 'Băiat' },
    { value: 'Female', label: 'Fată' },
    { value: 'Unknown', label: 'Necunoscut' },
  ];

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    sex: ['Unknown' as Sex],
    notes: [''],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.editId = id;
      this.babyService.getById(id).subscribe((baby) => {
        this.form.patchValue({
          name: baby.name,
          dateOfBirth: baby.dateOfBirth,
          sex: baby.sex,
          notes: baby.notes ?? '',
        });
      });
    }
  }

  goBack() {
    this.router.navigate(['/settings']);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const value = this.form.getRawValue();
    const dto = {
      name: value.name,
      dateOfBirth: value.dateOfBirth,
      sex: value.sex,
      notes: value.notes || null,
    };

    const action$ = this.isEdit()
      ? this.babyService.update(this.editId, dto)
      : this.babyService.create(dto);

    action$.subscribe({
      next: () => {
        this.babyCtx.refresh();
        this.router.navigate(['/settings']);
      },
      error: () => this.submitting.set(false),
    });
  }
}
