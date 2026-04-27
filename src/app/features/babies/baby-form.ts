import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BabyService } from '../../core/services';
import { Sex } from '../../core/models';

@Component({
  selector: 'app-baby-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="mb-6">
      <a routerLink="/babies" class="text-sm text-luna-600 hover:text-luna-800 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Inapoi
      </a>
    </div>

    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      {{ isEdit() ? 'Editeaza bebelus' : 'Adauga bebelus' }}
    </h1>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nume</label>
        <input id="name" formControlName="name" type="text" autocomplete="off"
               class="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-luna-500 focus:ring-2 focus:ring-luna-200 outline-none transition" />
      </div>

      <!-- Date of Birth -->
      <div>
        <label for="dob" class="block text-sm font-medium text-gray-700 mb-1">Data nasterii</label>
        <input id="dob" formControlName="dateOfBirth" type="date"
               class="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-luna-500 focus:ring-2 focus:ring-luna-200 outline-none transition" />
      </div>

      <!-- Sex -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Sex</label>
        <div class="flex gap-3">
          @for (option of sexOptions; track option.value) {
            <label class="flex-1 cursor-pointer">
              <input type="radio" formControlName="sex" [value]="option.value" class="peer sr-only" />
              <div class="text-center rounded-xl border border-gray-300 py-2.5 text-sm font-medium
                          peer-checked:border-luna-500 peer-checked:bg-luna-50 peer-checked:text-luna-700 transition">
                {{ option.label }}
              </div>
            </label>
          }
        </div>
      </div>

      <!-- Notes -->
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
        <textarea id="notes" formControlName="notes" rows="3"
                  class="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-luna-500 focus:ring-2 focus:ring-luna-200 outline-none transition resize-none"></textarea>
      </div>

      <!-- Submit -->
      <button type="submit" [disabled]="form.invalid || submitting()"
              class="w-full rounded-xl bg-luna-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-luna-700 disabled:opacity-50 transition">
        @if (submitting()) {
          <span class="inline-flex items-center gap-2">
            <span class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            Se salveaza...
          </span>
        } @else {
          {{ isEdit() ? 'Salveaza' : 'Adauga' }}
        }
      </button>
    </form>
  `,
})
export class BabyFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly babyService = inject(BabyService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEdit = signal(false);
  submitting = signal(false);
  private editId = '';

  sexOptions: { value: Sex; label: string }[] = [
    { value: 'Male', label: 'Baiat' },
    { value: 'Female', label: 'Fata' },
    { value: 'Unknown', label: 'Nespecificat' },
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
      next: () => this.router.navigate(['/babies']),
      error: () => this.submitting.set(false),
    });
  }
}
