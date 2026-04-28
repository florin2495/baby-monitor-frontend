import { Component, inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BabyContextService, FeedingService, SleepService, DiaperService } from '../../core/services';

interface TimelineEvent {
  type: 'feeding' | 'sleep' | 'diaper';
  time: Date;
  label: string;
  detail: string;
  icon: string;
  bg: string;
  color: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h1 class="font-heading" style="font-size: 22px; font-weight: 800; color: #3B2E26; margin: 0 0 4px;">Istoric</h1>
    <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 0 0: 16px;">Toate evenimentele în ordine cronologică</p>

    <!-- Filter pills -->
    <div style="display: flex; gap: 8px; margin: 16px 0;">
      <button class="filter-pill" [class.filter-pill--active]="filter() === 'all'" (click)="filter.set('all')">Toate</button>
      <button class="filter-pill" [class.filter-pill--active]="filter() === 'feeding'" (click)="filter.set('feeding')">Hrănire</button>
      <button class="filter-pill" [class.filter-pill--active]="filter() === 'sleep'" (click)="filter.set('sleep')">Somn</button>
      <button class="filter-pill" [class.filter-pill--active]="filter() === 'diaper'" (click)="filter.set('diaper')">Scutec</button>
    </div>

    @if (filteredEvents().length > 0) {
      <div style="position: relative; padding-left: 24px;">
        <!-- Timeline line -->
        <div style="position: absolute; left: 4px; top: 8px; bottom: 8px; width: 2px; background: #F5E6DE; border-radius: 1px;"></div>

        @for (evt of filteredEvents(); track $index) {
          <div style="position: relative; margin-bottom: 16px;">
            <!-- Dot -->
            <div style="position: absolute; left: -24px; top: 6px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px rgba(0,0,0,0.06);"
                 [style.background]="evt.color"></div>
            <!-- Card -->
            <div class="luna-card" style="padding: 12px 14px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px;"
                     [style.background]="evt.bg">
                  {{ evt.icon }}
                </div>
                <div style="flex: 1; min-width: 0;">
                  <p class="font-body" style="font-size: 14px; font-weight: 600; color: #3B2E26; margin: 0;">{{ evt.label }}</p>
                  <p class="font-body" style="font-size: 12px; color: #C4A99A; margin: 2px 0 0;">{{ evt.detail }}</p>
                </div>
                <span class="font-body" style="font-size: 12px; color: #C4A99A; flex-shrink: 0;">{{ evt.time | date:'HH:mm' }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    } @else if (loading()) {
      <div style="display: flex; justify-content: center; padding: 60px 0;">
        <div style="width: 32px; height: 32px; border: 3px solid #EDE9FE; border-top-color: #8B5CF6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
      </div>
    } @else {
      <div style="text-align: center; padding: 60px 20px;">
        <div style="width: 64px; height: 64px; border-radius: 20px; background: #F5F3FF; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p class="font-body" style="font-size: 14px; color: #C4A99A;">Nicio activitate încă.</p>
      </div>
    }
  `,
  styles: [`
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class TimelineComponent {
  readonly ctx = inject(BabyContextService);
  private readonly feedingService = inject(FeedingService);
  private readonly sleepService = inject(SleepService);
  private readonly diaperService = inject(DiaperService);

  allEvents = signal<TimelineEvent[]>([]);
  filter = signal<'all' | 'feeding' | 'sleep' | 'diaper'>('all');
  loading = signal(true);

  filteredEvents = signal<TimelineEvent[]>([]);

  private filterEffect = effect(() => {
    const f = this.filter();
    const all = this.allEvents();
    this.filteredEvents.set(f === 'all' ? all : all.filter(e => e.type === f));
  });

  private dataEffect = effect(() => {
    const baby = this.ctx.activeBaby();
    if (baby) this.loadTimeline(baby.id);
  });

  private loadTimeline(babyId: string) {
    this.loading.set(true);
    const events: TimelineEvent[] = [];
    let pending = 3;
    const done = () => {
      pending--;
      if (pending === 0) {
        events.sort((a, b) => b.time.getTime() - a.time.getTime());
        this.allEvents.set(events);
        this.loading.set(false);
      }
    };

    this.feedingService.getAll(babyId).subscribe(items => {
      for (const f of items) {
        const srcMap: Record<string, string> = {
          'LeftBreast': 'Sân stâng', 'RightBreast': 'Sân drept', 'BothBreasts': 'Ambele',
          'Bottle': 'Biberon', 'Formula': 'Formulă', 'Solid': 'Solid', 'Unknown': 'Hrănire',
        };
        events.push({
          type: 'feeding', time: new Date(f.occurredAt), label: 'Hrănire',
          detail: `${srcMap[f.source] ?? f.source}${f.amountMl ? ' · ' + f.amountMl + 'ml' : ''}`,
          icon: '🍼', bg: '#FFF7ED', color: '#F97316',
        });
      }
      done();
    });

    this.sleepService.getAll(babyId).subscribe(items => {
      for (const s of items) {
        const endStr = s.endedAt ? new Date(s.endedAt).toLocaleTimeString('ro', { hour: '2-digit', minute: '2-digit' }) : 'în desfășurare';
        events.push({
          type: 'sleep', time: new Date(s.startedAt), label: 'Somn',
          detail: endStr === 'în desfășurare' ? 'În desfășurare' : `Până la ${endStr}`,
          icon: '🌙', bg: '#F5F3FF', color: '#8B5CF6',
        });
      }
      done();
    });

    this.diaperService.getAll(babyId).subscribe(items => {
      for (const d of items) {
        const typeMap: Record<string, string> = { 'Pee': 'Udat', 'Poo': 'Murdar', 'Mixed': 'Mixt', 'Dry': 'Uscat', 'Unknown': 'Scutec' };
        events.push({
          type: 'diaper', time: new Date(d.occurredAt), label: 'Scutec',
          detail: typeMap[d.type] ?? d.type,
          icon: '👶', bg: '#F0FDFA', color: '#14B8A6',
        });
      }
      done();
    });
  }
}
