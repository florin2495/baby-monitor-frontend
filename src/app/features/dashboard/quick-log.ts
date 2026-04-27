import { Component, inject, input, output } from '@angular/core';
import { FeedingService, SleepService, DiaperService } from '../../core/services';

@Component({
  selector: 'app-quick-log',
  standalone: true,
  template: `
    <div class="grid grid-cols-3 gap-3">
      <!-- Feeding -->
      <button (click)="logFeeding()"
              class="flex flex-col items-center gap-1.5 rounded-2xl bg-baby-peach p-4 text-orange-700 hover:shadow-md transition active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12" />
        </svg>
        <span class="text-xs font-medium">Hranire</span>
      </button>

      <!-- Sleep -->
      <button (click)="logSleep()"
              class="flex flex-col items-center gap-1.5 rounded-2xl bg-luna-50 p-4 text-luna-700 hover:shadow-md transition active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
        <span class="text-xs font-medium">Somn</span>
      </button>

      <!-- Diaper -->
      <button (click)="logDiaper()"
              class="flex flex-col items-center gap-1.5 rounded-2xl bg-baby-mint p-4 text-teal-700 hover:shadow-md transition active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
        <span class="text-xs font-medium">Scutec</span>
      </button>
    </div>
  `,
})
export class QuickLogComponent {
  private readonly feedingService = inject(FeedingService);
  private readonly sleepService = inject(SleepService);
  private readonly diaperService = inject(DiaperService);

  babyId = input.required<string>();
  logged = output<void>();

  logFeeding() {
    this.feedingService
      .create(this.babyId(), { occurredAt: new Date().toISOString(), source: 'Unknown' })
      .subscribe(() => this.logged.emit());
  }

  logSleep() {
    this.sleepService
      .create(this.babyId(), { startedAt: new Date().toISOString() })
      .subscribe(() => this.logged.emit());
  }

  logDiaper() {
    this.diaperService
      .create(this.babyId(), { occurredAt: new Date().toISOString(), type: 'Unknown' })
      .subscribe(() => this.logged.emit());
  }
}
