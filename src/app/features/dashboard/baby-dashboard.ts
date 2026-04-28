import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FeedingEntry, SleepEntry, DiaperEntry } from '../../core/models';
import { FeedingService, SleepService, DiaperService, BabyContextService } from '../../core/services';

@Component({
  selector: 'app-baby-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    @if (ctx.activeBaby(); as b) {
      <!-- Baby header card -->
      <div class="luna-card" style="margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; font-family: 'Nunito', sans-serif;"
               [style.background]="babyBg()"
               [style.color]="babyColor()">
            {{ b.name.charAt(0).toUpperCase() }}
          </div>
          <div style="flex: 1; min-width: 0;">
            <h1 class="font-heading" style="font-size: 20px; font-weight: 800; color: #3B2E26; margin: 0; line-height: 1.2;">{{ b.name }}</h1>
            <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 4px 0 0;">{{ b.dateOfBirth | date:'d MMMM yyyy' }}</p>
          </div>
          <a [routerLink]="['/babies', b.id, 'edit']"
             class="touch-bounce"
             style="width: 36px; height: 36px; border-radius: 12px; background: #EDE9FE; display: flex; align-items: center; justify-content: center; text-decoration: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Active sleep banner -->
      @if (activeSleep(); as s) {
        <div style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); border-radius: 16px; padding: 14px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <p class="font-heading" style="font-size: 14px; font-weight: 700; color: white; margin: 0;">Somn în desfășurare</p>
            <p class="font-body" style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 2px 0 0;">De la {{ s.startedAt | date:'HH:mm' }}</p>
          </div>
          <button class="touch-bounce" (click)="stopSleep(s)" [disabled]="stoppingSleep()"
                  style="background: white; color: #7C3AED; border: none; border-radius: 12px; padding: 10px 16px; font-family: 'Nunito Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer;">
            @if (stoppingSleep()) { ... } @else { Oprește }
          </button>
        </div>
      }

      <!-- Stat cards row -->
      <div class="section-label">Rezumat azi</div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
        <div class="stat-card">
          <div class="stat-card__icon" style="background: #FFF7ED;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <div class="stat-card__value">{{ todayFeedings() }}</div>
          <div class="stat-card__label">Hrăniri</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon" style="background: #F5F3FF;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </div>
          <div class="stat-card__value">{{ todaySleepHrs() }}</div>
          <div class="stat-card__label">Ore somn</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon" style="background: #F0FDFA;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M8 12h8"/><path d="M12 8v8"/>
            </svg>
          </div>
          <div class="stat-card__value">{{ todayDiapers() }}</div>
          <div class="stat-card__label">Scutece</div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="section-label">Ultima activitate</div>
      <div class="luna-card" style="padding: 0; overflow: hidden;">
        <!-- Feeding -->
        <div style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid rgba(245,230,222,0.5);">
          <div style="width: 38px; height: 38px; border-radius: 12px; background: #FFF7ED; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <p class="font-body" style="font-size: 15px; font-weight: 600; color: #3B2E26; margin: 0;">Hrănire</p>
            @if (lastFeeding(); as f) {
              <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 2px 0 0;">{{ formatSource(f.source) }} · {{ f.occurredAt | date:'HH:mm' }}@if (f.amountMl) { · {{ f.amountMl }}ml }</p>
            } @else {
              <p class="font-body" style="font-size: 13px; color: #F5E6DE; margin: 2px 0 0;">Nicio înregistrare</p>
            }
          </div>
        </div>

        <!-- Sleep -->
        <div style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid rgba(245,230,222,0.5);">
          <div style="width: 38px; height: 38px; border-radius: 12px; background: #F5F3FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <p class="font-body" style="font-size: 15px; font-weight: 600; color: #3B2E26; margin: 0;">Somn</p>
            @if (lastSleep(); as s) {
              <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 2px 0 0;">
                {{ s.startedAt | date:'HH:mm' }}@if (s.endedAt) { — {{ s.endedAt | date:'HH:mm' }} } @else { · <span style="color: #8B5CF6; font-weight: 600;">în desfășurare</span> }
              </p>
            } @else {
              <p class="font-body" style="font-size: 13px; color: #F5E6DE; margin: 2px 0 0;">Nicio înregistrare</p>
            }
          </div>
        </div>

        <!-- Diaper -->
        <div style="display: flex; align-items: center; gap: 12px; padding: 14px 16px;">
          <div style="width: 38px; height: 38px; border-radius: 12px; background: #F0FDFA; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M8 12h8"/><path d="M12 8v8"/>
            </svg>
          </div>
          <div style="flex: 1; min-width: 0;">
            <p class="font-body" style="font-size: 15px; font-weight: 600; color: #3B2E26; margin: 0;">Scutec</p>
            @if (lastDiaper(); as d) {
              <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 2px 0 0;">{{ formatDiaperType(d.type) }} · {{ d.occurredAt | date:'HH:mm' }}</p>
            } @else {
              <p class="font-body" style="font-size: 13px; color: #F5E6DE; margin: 2px 0 0;">Nicio înregistrare</p>
            }
          </div>
        </div>
      </div>
    } @else if (ctx.loading()) {
      <div style="display: flex; justify-content: center; padding: 60px 0;">
        <div style="width: 32px; height: 32px; border: 3px solid #EDE9FE; border-top-color: #8B5CF6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
      </div>
    } @else {
      <!-- No babies yet -->
      <div style="text-align: center; padding: 60px 20px;">
        <div style="width: 80px; height: 80px; border-radius: 24px; background: #F5F3FF; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <h2 class="font-heading" style="font-size: 20px; font-weight: 700; color: #3B2E26; margin: 0 0 8px;">Bun venit în Luna!</h2>
        <p class="font-body" style="font-size: 14px; color: #C4A99A; margin: 0 0 24px;">Adaugă primul tău bebeluș pentru a începe să urmărești activitățile.</p>
        <a routerLink="/babies/new" class="btn-primary" style="text-decoration: none;">Adaugă bebeluș</a>
      </div>
    }
  `,
  styles: [`
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class BabyDashboardComponent implements OnInit {
  readonly ctx = inject(BabyContextService);
  private readonly feedingService = inject(FeedingService);
  private readonly sleepService = inject(SleepService);
  private readonly diaperService = inject(DiaperService);

  lastFeeding = signal<FeedingEntry | null>(null);
  lastSleep = signal<SleepEntry | null>(null);
  lastDiaper = signal<DiaperEntry | null>(null);
  activeSleep = signal<SleepEntry | null>(null);
  stoppingSleep = signal(false);
  todayFeedings = signal(0);
  todaySleepHrs = signal('0');
  todayDiapers = signal(0);

  private babyEffect = effect(() => {
    const baby = this.ctx.activeBaby();
    if (baby) {
      this.loadData(baby.id);
    }
  });

  ngOnInit() {}

  babyBg() {
    return this.ctx.getBabyColor(this.ctx.activeIndex()).bg;
  }

  babyColor() {
    return this.ctx.getBabyColor(this.ctx.activeIndex()).text;
  }

  stopSleep(sleep: SleepEntry) {
    const baby = this.ctx.activeBaby();
    if (!baby) return;
    this.stoppingSleep.set(true);
    this.sleepService.update(baby.id, sleep.id, {
      startedAt: sleep.startedAt,
      endedAt: new Date().toISOString(),
      location: sleep.location,
      notes: sleep.notes,
    }).subscribe({
      next: () => {
        this.stoppingSleep.set(false);
        this.loadData(baby.id);
      },
      error: () => this.stoppingSleep.set(false),
    });
  }

  private loadData(babyId: string) {
    this.feedingService.getAll(babyId).subscribe(items => {
      this.lastFeeding.set(items[0] ?? null);
      const today = new Date().toDateString();
      this.todayFeedings.set(items.filter(i => new Date(i.occurredAt).toDateString() === today).length);
    });
    this.sleepService.getAll(babyId).subscribe(items => {
      this.lastSleep.set(items[0] ?? null);
      // Find active (ongoing) sleep
      this.activeSleep.set(items.find(s => !s.endedAt) ?? null);
      const today = new Date().toDateString();
      const todayItems = items.filter(i => new Date(i.startedAt).toDateString() === today);
      let totalMin = 0;
      for (const s of todayItems) {
        const start = new Date(s.startedAt).getTime();
        const end = s.endedAt ? new Date(s.endedAt).getTime() : Date.now();
        totalMin += (end - start) / 60000;
      }
      this.todaySleepHrs.set((totalMin / 60).toFixed(1));
    });
    this.diaperService.getAll(babyId).subscribe(items => {
      this.lastDiaper.set(items[0] ?? null);
      const today = new Date().toDateString();
      this.todayDiapers.set(items.filter(i => new Date(i.occurredAt).toDateString() === today).length);
    });
  }

  formatSource(source: string): string {
    const map: Record<string, string> = {
      'LeftBreast': 'Sân stâng', 'RightBreast': 'Sân drept', 'BothBreasts': 'Ambele',
      'Bottle': 'Biberon', 'Formula': 'Formulă', 'Solid': 'Solid', 'Unknown': 'Hrănire',
    };
    return map[source] ?? source;
  }

  formatDiaperType(type: string): string {
    const map: Record<string, string> = {
      'Pee': 'Udat', 'Poo': 'Murdar', 'Mixed': 'Mixt', 'Dry': 'Uscat', 'Unknown': 'Scutec',
    };
    return map[type] ?? type;
  }
}
