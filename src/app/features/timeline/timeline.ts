import { Component, inject, signal, effect, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BabyContextService, FeedingService, SleepService, DiaperService, MedicationService, OverlayService } from '../../core/services';
import { FeedingEntry, SleepEntry, DiaperEntry, MedicationEntry, FeedingSource } from '../../core/models';

interface TimelineEvent {
  type: 'feeding' | 'sleep' | 'diaper' | 'medication';
  time: Date;
  label: string;
  details: string[];
  icon: string;
  bg: string;
  color: string;
  raw: any;
  id: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h1 class="font-heading" style="font-size: 22px; font-weight: 800; color: #3B2E26; margin: 0 0 4px;">Istoric</h1>
    <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 0 0 16px;">Toate evenimentele în ordine cronologică</p>

    <!-- Date range selector -->
    <div class="luna-card" style="padding: 12px 14px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="flex: 1;">
          <div class="section-label" style="margin-bottom: 4px;">De la</div>
          <input type="datetime-local" class="luna-input" style="padding: 8px 10px; font-size: 13px;"
                 [value]="startDate()" (input)="startDate.set($any($event.target).value)" />
        </div>
        <div style="flex: 1;">
          <div class="section-label" style="margin-bottom: 4px;">Până la</div>
          <input type="datetime-local" class="luna-input" style="padding: 8px 10px; font-size: 13px;"
                 [value]="endDate()" (input)="endDate.set($any($event.target).value)" />
        </div>
      </div>
    </div>

    <!-- Multi-select filter pills -->
    <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
      @for (f of filterOptions; track f.type) {
        <button class="filter-pill" [class.filter-pill--active]="isFilterActive(f.type)"
                (click)="toggleFilter(f.type)">{{ f.label }}</button>
      }
    </div>

    @if (filteredEvents().length > 0) {
      <div style="position: relative; padding-left: 24px;">
        <div style="position: absolute; left: 4px; top: 8px; bottom: 8px; width: 2px; background: #F5E6DE; border-radius: 1px;"></div>

        @for (evt of filteredEvents(); track evt.id + evt.time.getTime()) {
          <div style="position: relative; margin-bottom: 14px;">
            <div style="position: absolute; left: -24px; top: 6px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px rgba(0,0,0,0.06);"
                 [style.background]="evt.color"></div>
            <div class="luna-card" style="padding: 12px 14px;">
              <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px;"
                     [style.background]="evt.bg">{{ evt.icon }}</div>
                <div style="flex: 1; min-width: 0;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <p class="font-body" style="font-size: 14px; font-weight: 600; color: #3B2E26; margin: 0;">{{ evt.label }}</p>
                    <span class="font-body" style="font-size: 12px; color: #C4A99A;">{{ evt.time | date:'HH:mm' }}</span>
                  </div>
                  @for (d of evt.details; track $index) {
                    <p class="font-body" style="font-size: 12px; color: #8B7263; margin: 2px 0 0;">{{ d }}</p>
                  }
                </div>
                <button class="touch-bounce" (click)="editEvent(evt)"
                        style="width: 28px; height: 28px; border-radius: 8px; background: #EDE9FE; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
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
        <p class="font-body" style="font-size: 14px; color: #C4A99A;">Nicio activitate în intervalul selectat.</p>
      </div>
    }

    <!-- ═══ EDIT BOTTOM SHEETS ═══ -->

    <!-- Edit Feeding -->
    @if (editingType() === 'feeding') {
      <div class="bottom-sheet-backdrop" (click)="cancelEdit()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <button class="touch-bounce" (click)="deleteEvent()"
                  style="width: 32px; height: 32px; border-radius: 10px; background: #FEE2E2; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
          <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0;">Editează hrănire</h2>
          <div style="width: 32px;"></div>
        </div>
        <div class="section-label">Data și ora</div>
        <input type="datetime-local" class="luna-input" [value]="editDateTime()" (input)="editDateTime.set($any($event.target).value)" style="margin-bottom: 14px;" />
        <div class="section-label">Sursă</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
          @for (src of feedingSources; track src.value) {
            <button class="source-pill" [class.source-pill--active]="editFeedingSource() === src.value"
                    (click)="editFeedingSource.set(src.value)">{{ src.label }}</button>
          }
        </div>
        <div class="section-label">Cantitate (ml)</div>
        <div class="stepper" style="margin-bottom: 16px;">
          <button class="stepper__btn" (click)="editFeedingMl.set(Math.max(0, editFeedingMl() - 10))">−</button>
          <input type="number" class="luna-input" style="width: 70px; text-align: center; font-size: 16px; font-weight: 700; padding: 6px;" [value]="editFeedingMl()" (input)="editFeedingMl.set(+$any($event.target).value)" />
          <button class="stepper__btn" (click)="editFeedingMl.set(editFeedingMl() + 10)">+</button>
        </div>
        <div class="section-label">Durată (minute)</div>
        <div class="stepper" style="margin-bottom: 20px;">
          <button class="stepper__btn" (click)="editFeedingMin.set(Math.max(0, editFeedingMin() - 1))">−</button>
          <input type="number" class="luna-input" style="width: 70px; text-align: center; font-size: 16px; font-weight: 700; padding: 6px;" [value]="editFeedingMin()" (input)="editFeedingMin.set(+$any($event.target).value)" />
          <button class="stepper__btn" (click)="editFeedingMin.set(editFeedingMin() + 1)">+</button>
        </div>
        <button class="btn-primary" style="width: 100%;" [disabled]="editSaving()" (click)="saveEditFeeding()">
          @if (editSaving()) { Se salvează... } @else { Salvează }
        </button>
      </div>
    }

    <!-- Edit Sleep -->
    @if (editingType() === 'sleep') {
      <div class="bottom-sheet-backdrop" (click)="cancelEdit()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <button class="touch-bounce" (click)="deleteEvent()"
                  style="width: 32px; height: 32px; border-radius: 10px; background: #FEE2E2; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
          <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0;">Editează somn</h2>
          <div style="width: 32px;"></div>
        </div>
        <div class="section-label">Început</div>
        <input type="datetime-local" class="luna-input" [value]="editSleepStart()" (input)="editSleepStart.set($any($event.target).value)" style="margin-bottom: 12px;" />
        <div class="section-label">Sfârșit</div>
        <input type="datetime-local" class="luna-input" [value]="editSleepEnd()" (input)="editSleepEnd.set($any($event.target).value)" style="margin-bottom: 12px;" />
        <div class="section-label">Note</div>
        <textarea class="luna-input" rows="2" [value]="editSleepNotes()" (input)="editSleepNotes.set($any($event.target).value)" style="margin-bottom: 20px;"></textarea>
        <button class="btn-primary" style="width: 100%;" [disabled]="editSaving()" (click)="saveEditSleep()">
          @if (editSaving()) { Se salvează... } @else { Salvează }
        </button>
      </div>
    }

    <!-- Edit Diaper -->
    @if (editingType() === 'diaper') {
      <div class="bottom-sheet-backdrop" (click)="cancelEdit()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <button class="touch-bounce" (click)="deleteEvent()"
                  style="width: 32px; height: 32px; border-radius: 10px; background: #FEE2E2; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
          <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0;">Editează scutec</h2>
          <div style="width: 32px;"></div>
        </div>
        <div class="section-label">Data și ora</div>
        <input type="datetime-local" class="luna-input" [value]="editDateTime()" (input)="editDateTime.set($any($event.target).value)" style="margin-bottom: 14px;" />
        <div class="section-label">Tip</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          @for (dt of diaperTypeOptions; track dt.value) {
            <button class="source-pill" [class.source-pill--active]="editDiaperType() === dt.value"
                    (click)="editDiaperType.set(dt.value)">{{ dt.label }}</button>
          }
        </div>
        <button class="btn-primary" style="width: 100%;" [disabled]="editSaving()" (click)="saveEditDiaper()">
          @if (editSaving()) { Se salvează... } @else { Salvează }
        </button>
      </div>
    }

    <!-- Edit Medication -->
    @if (editingType() === 'medication') {
      <div class="bottom-sheet-backdrop" (click)="cancelEdit()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <button class="touch-bounce" (click)="deleteEvent()"
                  style="width: 32px; height: 32px; border-radius: 10px; background: #FEE2E2; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
          <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0;">Editează medicație</h2>
          <div style="width: 32px;"></div>
        </div>
        <div class="section-label">Data și ora</div>
        <input type="datetime-local" class="luna-input" [value]="editDateTime()" (input)="editDateTime.set($any($event.target).value)" style="margin-bottom: 14px;" />
        <div class="section-label">Nume</div>
        <input class="luna-input" [value]="editMedName()" (input)="editMedName.set($any($event.target).value)" style="margin-bottom: 12px;" />
        <div class="section-label">Doză</div>
        <input class="luna-input" type="number" [value]="editMedDose()" (input)="editMedDose.set(+$any($event.target).value)" style="margin-bottom: 12px;" />
        <div class="section-label">Unitate</div>
        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
          @for (u of medUnits; track u) {
            <button class="source-pill" [class.source-pill--active]="editMedUnit() === u"
                    (click)="editMedUnit.set(u)">{{ u }}</button>
          }
        </div>
        <button class="btn-primary" style="width: 100%;" [disabled]="editSaving()" (click)="saveEditMedication()">
          @if (editSaving()) { Se salvează... } @else { Salvează }
        </button>
      </div>
    }

    <!-- Delete confirmation -->
    @if (confirmDelete()) {
      <div class="bottom-sheet-backdrop" style="z-index: 210;" (click)="confirmDelete.set(false)"></div>
      <div style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 211; background: white; border-radius: 20px 20px 0 0; padding: 24px 20px calc(24px + env(safe-area-inset-bottom, 0px)); box-shadow: 0 -4px 24px rgba(0,0,0,0.12);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 48px; height: 48px; border-radius: 14px; background: #FEE2E2; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </div>
          <h3 class="font-heading" style="font-size: 17px; font-weight: 700; color: #3B2E26; margin: 0 0 4px;">Șterge activitatea?</h3>
          <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 0;">Această acțiune nu poate fi anulată.</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn-primary" style="flex: 1; background: #F5E6DE; color: #8B7263;" (click)="confirmDelete.set(false)">Anulează</button>
          <button class="btn-primary" style="flex: 1; background: #EF4444;" [disabled]="editSaving()" (click)="confirmDeleteAction()">
            @if (editSaving()) { ... } @else { Șterge }
          </button>
        </div>
      </div>
    }

    @if (showToast()) {
      <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: #3B2E26; color: white; padding: 12px 24px; border-radius: 14px; font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 600; z-index: 300; animation: fadeIn 0.2s ease;">
        {{ toastMessage() }}
      </div>
    }
  `,
  styles: [`@keyframes spin { to { transform: rotate(360deg); } }`]
})
export class TimelineComponent {
  readonly ctx = inject(BabyContextService);
  private readonly overlay = inject(OverlayService);
  private readonly feedingService = inject(FeedingService);
  private readonly sleepService = inject(SleepService);
  private readonly diaperService = inject(DiaperService);
  private readonly medicationService = inject(MedicationService);

  Math = Math;
  allEvents = signal<TimelineEvent[]>([]);
  loading = signal(true);
  showToast = signal(false);
  toastMessage = signal('Actualizat cu succes');

  // Filters — multi-select
  filterOptions = [
    { type: 'feeding', label: 'Hrănire' },
    { type: 'sleep', label: 'Somn' },
    { type: 'diaper', label: 'Scutece' },
    { type: 'medication', label: 'Medicație' },
  ];
  activeFilters = signal<Set<string>>(new Set(['feeding', 'sleep', 'diaper', 'medication']));

  // Date range — default today 00:00 to now
  startDate = signal(this.todayStart());
  endDate = signal(this.nowLocal());

  filteredEvents = computed(() => {
    const filters = this.activeFilters();
    const start = new Date(this.startDate()).getTime();
    const end = new Date(this.endDate()).getTime();
    return this.allEvents().filter(e =>
      filters.has(e.type) &&
      e.time.getTime() >= start &&
      e.time.getTime() <= end
    );
  });

  // Edit state
  editingType = signal<string | null>(null);
  editingEvent = signal<TimelineEvent | null>(null);
  editSaving = signal(false);
  confirmDelete = signal(false);

  // Edit common — date/time
  editDateTime = signal('');

  // Edit feeding
  editFeedingSource = signal<FeedingSource>('Bottle');
  editFeedingMl = signal(0);
  editFeedingMin = signal(0);
  feedingSources: { value: FeedingSource; label: string }[] = [
    { value: 'LeftBreast', label: 'Sân stâng' }, { value: 'RightBreast', label: 'Sân drept' },
    { value: 'BothBreasts', label: 'Ambele' }, { value: 'Bottle', label: 'Biberon' },
    { value: 'Formula', label: 'Formulă' }, { value: 'Solid', label: 'Solid' },
  ];

  // Edit sleep
  editSleepStart = signal('');
  editSleepEnd = signal('');
  editSleepNotes = signal('');

  // Edit diaper
  editDiaperType = signal<'Pee' | 'Poo' | 'Mixed' | 'Dry'>('Pee');
  diaperTypeOptions = [
    { value: 'Pee' as const, label: 'Udat' }, { value: 'Poo' as const, label: 'Murdar' },
    { value: 'Mixed' as const, label: 'Mixt' }, { value: 'Dry' as const, label: 'Uscat' },
  ];

  // Edit medication
  editMedName = signal('');
  editMedDose = signal(0);
  editMedUnit = signal('ml');
  medUnits = ['ml', 'mg', 'picături'];

  private dataEffect = effect(() => {
    const baby = this.ctx.activeBaby();
    if (baby) this.loadTimeline(baby.id);
  });

  isFilterActive(type: string): boolean {
    return this.activeFilters().has(type);
  }

  toggleFilter(type: string) {
    const current = new Set(this.activeFilters());
    if (current.has(type)) {
      if (current.size > 1) current.delete(type);
    } else {
      current.add(type);
    }
    this.activeFilters.set(current);
  }

  private todayStart(): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return this.toLocalISO(d);
  }

  private nowLocal(): string {
    return this.toLocalISO(new Date());
  }

  private toLocalISO(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private srcMap: Record<string, string> = {
    'LeftBreast': 'Sân stâng', 'RightBreast': 'Sân drept', 'BothBreasts': 'Ambele',
    'Bottle': 'Biberon', 'Formula': 'Formulă', 'Solid': 'Solid', 'Unknown': 'Necunoscut',
  };
  private diaperMap: Record<string, string> = {
    'Pee': 'Udat', 'Poo': 'Murdar', 'Mixed': 'Mixt', 'Dry': 'Uscat', 'Unknown': 'Necunoscut',
  };

  private loadTimeline(babyId: string) {
    this.loading.set(true);
    const events: TimelineEvent[] = [];
    let pending = 4;
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
        const details: string[] = [];
        details.push('Sursă: ' + (this.srcMap[f.source] ?? f.source));
        if (f.amountMl) details.push('Cantitate: ' + f.amountMl + ' ml');
        if (f.durationMinutes) details.push('Durată: ' + f.durationMinutes + ' min');
        events.push({ type: 'feeding', time: new Date(f.occurredAt), label: 'Hrănire', details, icon: '🍼', bg: '#FFF7ED', color: '#F97316', raw: f, id: f.id });
      }
      done();
    });

    this.sleepService.getAll(babyId).subscribe(items => {
      for (const s of items) {
        const details: string[] = [];
        const startStr = new Date(s.startedAt).toLocaleTimeString('ro', { hour: '2-digit', minute: '2-digit' });
        if (s.endedAt) {
          const endStr = new Date(s.endedAt).toLocaleTimeString('ro', { hour: '2-digit', minute: '2-digit' });
          const mins = Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 60000);
          details.push('De la ' + startStr + ' până la ' + endStr);
          details.push('Durată: ' + Math.floor(mins/60) + 'h ' + (mins%60) + 'min');
        } else {
          details.push('Început la ' + startStr + ' — în desfășurare');
        }
        if (s.notes) details.push('Note: ' + s.notes);
        events.push({ type: 'sleep', time: new Date(s.startedAt), label: 'Somn', details, icon: '🌙', bg: '#F5F3FF', color: '#8B5CF6', raw: s, id: s.id });
      }
      done();
    });

    this.diaperService.getAll(babyId).subscribe(items => {
      for (const d of items) {
        const details: string[] = [];
        details.push('Tip: ' + (this.diaperMap[d.type] ?? d.type));
        if (d.notes) details.push('Note: ' + d.notes);
        events.push({ type: 'diaper', time: new Date(d.occurredAt), label: 'Scutec', details, icon: '👶', bg: '#F0FDFA', color: '#14B8A6', raw: d, id: d.id });
      }
      done();
    });

    this.medicationService.getAll(babyId).subscribe(items => {
      for (const m of items) {
        const details: string[] = [];
        details.push('Medicament: ' + m.name);
        if (m.doseAmount) details.push('Doză: ' + m.doseAmount + ' ' + (m.doseUnit ?? ''));
        if (m.notes) details.push('Note: ' + m.notes);
        events.push({ type: 'medication', time: new Date(m.administeredAt), label: 'Medicație', details, icon: '💊', bg: '#FFF1F2', color: '#F43F5E', raw: m, id: m.id });
      }
      done();
    });
  }

  editEvent(evt: TimelineEvent) {
    this.editingEvent.set(evt);
    this.editingType.set(evt.type);
    this.overlay.show();

    if (evt.type === 'feeding') {
      const f = evt.raw as FeedingEntry;
      this.editDateTime.set(this.toLocalISO(new Date(f.occurredAt)));
      this.editFeedingSource.set(f.source);
      this.editFeedingMl.set(f.amountMl ?? 0);
      this.editFeedingMin.set(f.durationMinutes ?? 0);
    } else if (evt.type === 'sleep') {
      const s = evt.raw as SleepEntry;
      this.editSleepStart.set(this.toLocalISO(new Date(s.startedAt)));
      this.editSleepEnd.set(s.endedAt ? this.toLocalISO(new Date(s.endedAt)) : '');
      this.editSleepNotes.set(s.notes ?? '');
    } else if (evt.type === 'diaper') {
      const d = evt.raw as DiaperEntry;
      this.editDateTime.set(this.toLocalISO(new Date(d.occurredAt)));
      this.editDiaperType.set(d.type as any);
    } else if (evt.type === 'medication') {
      const m = evt.raw as MedicationEntry;
      this.editDateTime.set(this.toLocalISO(new Date(m.administeredAt)));
      this.editMedName.set(m.name);
      this.editMedDose.set(m.doseAmount ?? 0);
      this.editMedUnit.set(m.doseUnit ?? 'ml');
    }
  }

  cancelEdit() {
    this.editingType.set(null);
    this.editingEvent.set(null);
    this.confirmDelete.set(false);
    this.overlay.hide();
  }

  deleteEvent() {
    this.confirmDelete.set(true);
  }

  confirmDeleteAction() {
    const baby = this.ctx.activeBaby();
    const evt = this.editingEvent();
    if (!baby || !evt) return;
    this.editSaving.set(true);

    let obs;
    if (evt.type === 'feeding') obs = this.feedingService.delete(baby.id, evt.id);
    else if (evt.type === 'sleep') obs = this.sleepService.delete(baby.id, evt.id);
    else if (evt.type === 'diaper') obs = this.diaperService.delete(baby.id, evt.id);
    else obs = this.medicationService.delete(baby.id, evt.id);

    obs.subscribe({
      next: () => {
        this.editSaving.set(false);
        this.confirmDelete.set(false);
        this.cancelEdit();
        this.toastMessage.set('Șters cu succes');
        this.toast();
        this.loadTimeline(baby.id);
      },
      error: () => this.editSaving.set(false),
    });
  }

  private toast() {
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2000);
  }

  saveEditFeeding() {
    const baby = this.ctx.activeBaby();
    const evt = this.editingEvent();
    if (!baby || !evt) return;
    const f = evt.raw as FeedingEntry;
    this.editSaving.set(true);
    this.feedingService.update(baby.id, f.id, {
      occurredAt: new Date(this.editDateTime()).toISOString(),
      source: this.editFeedingSource(),
      amountMl: this.editFeedingMl() || null,
      durationMinutes: this.editFeedingMin() || null,
    }).subscribe({
      next: () => { this.editSaving.set(false); this.cancelEdit(); this.toastMessage.set('Actualizat cu succes'); this.toast(); this.loadTimeline(baby.id); },
      error: () => this.editSaving.set(false),
    });
  }

  saveEditSleep() {
    const baby = this.ctx.activeBaby();
    const evt = this.editingEvent();
    if (!baby || !evt) return;
    this.editSaving.set(true);
    this.sleepService.update(baby.id, evt.id, {
      startedAt: new Date(this.editSleepStart()).toISOString(),
      endedAt: this.editSleepEnd() ? new Date(this.editSleepEnd()).toISOString() : null,
      notes: this.editSleepNotes() || null,
    }).subscribe({
      next: () => { this.editSaving.set(false); this.cancelEdit(); this.toastMessage.set('Actualizat cu succes'); this.toast(); this.loadTimeline(baby.id); },
      error: () => this.editSaving.set(false),
    });
  }

  saveEditDiaper() {
    const baby = this.ctx.activeBaby();
    const evt = this.editingEvent();
    if (!baby || !evt) return;
    this.editSaving.set(true);
    this.diaperService.update(baby.id, evt.id, {
      occurredAt: new Date(this.editDateTime()).toISOString(),
      type: this.editDiaperType(),
    }).subscribe({
      next: () => { this.editSaving.set(false); this.cancelEdit(); this.toastMessage.set('Actualizat cu succes'); this.toast(); this.loadTimeline(baby.id); },
      error: () => this.editSaving.set(false),
    });
  }

  saveEditMedication() {
    const baby = this.ctx.activeBaby();
    const evt = this.editingEvent();
    if (!baby || !evt) return;
    const m = evt.raw as MedicationEntry;
    this.editSaving.set(true);
    this.medicationService.update(baby.id, m.id, {
      administeredAt: new Date(this.editDateTime()).toISOString(),
      name: this.editMedName(),
      doseAmount: this.editMedDose() || null,
      doseUnit: this.editMedUnit() || null,
    }).subscribe({
      next: () => { this.editSaving.set(false); this.cancelEdit(); this.toastMessage.set('Actualizat cu succes'); this.toast(); this.loadTimeline(baby.id); },
      error: () => this.editSaving.set(false),
    });
  }
}
