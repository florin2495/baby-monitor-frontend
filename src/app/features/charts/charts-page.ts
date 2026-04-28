import { Component, inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BabyContextService, FeedingService, SleepService, DiaperService, GrowthService } from '../../core/services';
import { GrowthEntry } from '../../core/models';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h1 class="font-heading" style="font-size: 22px; font-weight: 800; color: #3B2E26; margin: 0 0 4px;">Grafice</h1>
    <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 0 0 20px;">Statistici din ultimele 7 zile</p>

    @if (ctx.activeBaby()) {
      <!-- Feeding chart -->
      <div class="luna-card" style="margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 28px; height: 28px; border-radius: 8px; background: #FFF7ED; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
            </svg>
          </div>
          <span class="font-heading" style="font-size: 15px; font-weight: 700; color: #3B2E26;">Hrăniri / zi</span>
        </div>
        <div style="display: flex; align-items: flex-end; gap: 6px; height: 80px;">
          @for (d of feedingDays(); track d.label) {
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="width: 100%; border-radius: 8px 8px 4px 4px; background: #FFEDD5; min-height: 4px; transition: height 0.3s ease;"
                   [style.height.px]="d.count * 12 || 4"></div>
              <span class="font-body" style="font-size: 10px; color: #C4A99A;">{{ d.label }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Sleep chart -->
      <div class="luna-card" style="margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 28px; height: 28px; border-radius: 8px; background: #F5F3FF; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </div>
          <span class="font-heading" style="font-size: 15px; font-weight: 700; color: #3B2E26;">Ore somn / zi</span>
        </div>
        <div style="display: flex; align-items: flex-end; gap: 6px; height: 80px;">
          @for (d of sleepDays(); track d.label) {
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="width: 100%; border-radius: 8px 8px 4px 4px; background: #EDE9FE; min-height: 4px; transition: height 0.3s ease;"
                   [style.height.px]="d.hours * 5 || 4"></div>
              <span class="font-body" style="font-size: 10px; color: #C4A99A;">{{ d.label }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Diaper chart -->
      <div class="luna-card" style="margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 28px; height: 28px; border-radius: 8px; background: #F0FDFA; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <span class="font-heading" style="font-size: 15px; font-weight: 700; color: #3B2E26;">Scutece / zi</span>
        </div>
        <div style="display: flex; align-items: flex-end; gap: 6px; height: 80px;">
          @for (d of diaperDays(); track d.label) {
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="width: 100%; border-radius: 8px 8px 4px 4px; background: #CCFBF1; min-height: 4px; transition: height 0.3s ease;"
                   [style.height.px]="d.count * 12 || 4"></div>
              <span class="font-body" style="font-size: 10px; color: #C4A99A;">{{ d.label }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Growth -->
      <div class="luna-card">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 28px; height: 28px; border-radius: 8px; background: #EFF6FF; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span class="font-heading" style="font-size: 15px; font-weight: 700; color: #3B2E26;">Ultima măsurătoare</span>
        </div>
        @if (lastGrowth(); as g) {
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            <div style="text-align: center;">
              <div class="font-heading" style="font-size: 20px; font-weight: 700; color: #3B82F6;">{{ g.weightKg ?? '–' }}</div>
              <div class="font-body" style="font-size: 11px; color: #C4A99A;">kg</div>
            </div>
            <div style="text-align: center;">
              <div class="font-heading" style="font-size: 20px; font-weight: 700; color: #3B82F6;">{{ g.heightCm ?? '–' }}</div>
              <div class="font-body" style="font-size: 11px; color: #C4A99A;">cm</div>
            </div>
            <div style="text-align: center;">
              <div class="font-heading" style="font-size: 20px; font-weight: 700; color: #3B82F6;">{{ g.headCircumferenceCm ?? '–' }}</div>
              <div class="font-body" style="font-size: 11px; color: #C4A99A;">cap cm</div>
            </div>
          </div>
          <p class="font-body" style="font-size: 12px; color: #C4A99A; margin: 8px 0 0; text-align: center;">{{ g.measuredAt | date:'d MMM yyyy' }}</p>
        } @else {
          <p class="font-body" style="font-size: 14px; color: #C4A99A; text-align: center;">Nicio măsurătoare încă</p>
        }
      </div>
    } @else {
      <div style="text-align: center; padding: 60px 20px;">
        <p class="font-body" style="font-size: 14px; color: #C4A99A;">Adaugă un bebeluș pentru a vedea graficele.</p>
      </div>
    }
  `,
})
export class ChartsPageComponent {
  readonly ctx = inject(BabyContextService);
  private readonly feedingService = inject(FeedingService);
  private readonly sleepService = inject(SleepService);
  private readonly diaperService = inject(DiaperService);
  private readonly growthService = inject(GrowthService);

  feedingDays = signal<{ label: string; count: number }[]>([]);
  sleepDays = signal<{ label: string; hours: number }[]>([]);
  diaperDays = signal<{ label: string; count: number }[]>([]);
  lastGrowth = signal<GrowthEntry | null>(null);

  private dataEffect = effect(() => {
    const baby = this.ctx.activeBaby();
    if (baby) this.loadCharts(baby.id);
  });

  private loadCharts(babyId: string) {
    const days = this.last7Days();

    this.feedingService.getAll(babyId).subscribe(items => {
      this.feedingDays.set(days.map(d => ({
        label: d.label,
        count: items.filter(i => new Date(i.occurredAt).toDateString() === d.date).length,
      })));
    });

    this.sleepService.getAll(babyId).subscribe(items => {
      this.sleepDays.set(days.map(d => {
        const dayItems = items.filter(i => new Date(i.startedAt).toDateString() === d.date);
        let totalMin = 0;
        for (const s of dayItems) {
          const start = new Date(s.startedAt).getTime();
          const end = s.endedAt ? new Date(s.endedAt).getTime() : Date.now();
          totalMin += (end - start) / 60000;
        }
        return { label: d.label, hours: Math.round(totalMin / 60 * 10) / 10 };
      }));
    });

    this.diaperService.getAll(babyId).subscribe(items => {
      this.diaperDays.set(days.map(d => ({
        label: d.label,
        count: items.filter(i => new Date(i.occurredAt).toDateString() === d.date).length,
      })));
    });

    this.growthService.getAll(babyId).subscribe(items => {
      this.lastGrowth.set(items[0] ?? null);
    });
  }

  private last7Days(): { label: string; date: string }[] {
    const dayNames = ['Du', 'Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ'];
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push({ label: dayNames[d.getDay()], date: d.toDateString() });
    }
    return result;
  }
}
