import { Component, inject, input, output } from '@angular/core';
import { FeedingService, SleepService, DiaperService } from '../../core/services';

@Component({
  selector: 'app-quick-log',
  standalone: true,
  template: `
    <p class="text-[13px] text-[#8e8e93] uppercase tracking-wider font-medium mb-2">Inregistrare rapida</p>
    <div class="grid grid-cols-3 gap-2">
      <button (click)="logFeeding()"
              class="flex flex-col items-center gap-1 rounded-2xl bg-[#fff3e0] py-3 touch-bounce">
        <div class="w-10 h-10 rounded-full bg-[#ffe0b2] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#e65100]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M.99 5.24A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25l.01 9.5A2.25 2.25 0 0116.76 17H3.26A2.25 2.25 0 011 14.75l-.01-9.51zm8.26 9.52v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 00.627-.74zm1.5 0a.75.75 0 00.627.74h5.373a.75.75 0 00.75-.75v-.615a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75v.625zM10 .75a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V1.5A.75.75 0 0110 .75z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="text-[12px] font-medium text-[#e65100]">Hranire</span>
      </button>

      <button (click)="logSleep()"
              class="flex flex-col items-center gap-1 rounded-2xl bg-[#e8eaf6] py-3 touch-bounce">
        <div class="w-10 h-10 rounded-full bg-[#c5cae9] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#283593]" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 118.25 3.5a.75.75 0 01-.795-1.496z" clip-rule="evenodd"/>
          </svg>
        </div>
        <span class="text-[12px] font-medium text-[#283593]">Somn</span>
      </button>

      <button (click)="logDiaper()"
              class="flex flex-col items-center gap-1 rounded-2xl bg-[#e0f2f1] py-3 touch-bounce">
        <div class="w-10 h-10 rounded-full bg-[#b2dfdb] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#00695c]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 00.75.75h2.5a.75.75 0 00.75-.75v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0010 1zM8.863 17.414a.75.75 0 00-.226 1.483 9.066 9.066 0 002.726 0 .75.75 0 00-.226-1.483 7.553 7.553 0 01-2.274 0z"/>
          </svg>
        </div>
        <span class="text-[12px] font-medium text-[#00695c]">Scutec</span>
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
