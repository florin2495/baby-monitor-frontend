import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Baby } from '../models';
import { BabyService } from './baby.service';

@Injectable({ providedIn: 'root' })
export class BabyContextService {
  private readonly babyService = inject(BabyService);

  /** All babies loaded from API */
  readonly babies = signal<Baby[]>([]);

  /** Currently selected baby index */
  readonly activeIndex = signal(0);

  /** Currently active baby (derived) */
  readonly activeBaby = computed(() => {
    const list = this.babies();
    const idx = this.activeIndex();
    return list.length > 0 ? list[idx] ?? list[0] : null;
  });

  /** Loading state */
  readonly loading = signal(true);

  /** Baby identity colors */
  private readonly babyColors = [
    { bg: '#F3E8FF', text: '#7C3AED' },
    { bg: '#FEF3C7', text: '#D97706' },
    { bg: '#DBEAFE', text: '#2563EB' },
    { bg: '#D1FAE5', text: '#059669' },
  ];

  getBabyColor(index: number) {
    return this.babyColors[index % this.babyColors.length];
  }

  /** Load all babies from API */
  loadBabies() {
    this.loading.set(true);
    this.babyService.getAll().subscribe({
      next: (data) => {
        this.babies.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  /** Switch to a baby by index */
  switchBaby(index: number) {
    if (index >= 0 && index < this.babies().length) {
      this.activeIndex.set(index);
    }
  }

  /** Refresh babies list (after add/edit/delete) */
  refresh() {
    this.loadBabies();
  }
}
