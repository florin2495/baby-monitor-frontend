import { Component, inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BabyContextService, FeedingService, SleepService, DiaperService, GrowthService, MedicationService, OverlayService } from '../../core/services';
import { FeedingSource, SleepEntry } from '../../core/models';

@Component({
  selector: 'app-log-page',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h1 class="font-heading" style="font-size: 22px; font-weight: 800; color: #3B2E26; margin: 0 0 4px;">Înregistrare</h1>
    <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 0 0 20px;">Adaugă rapid o activitate</p>

    <!-- Active sleep banner -->
    @if (activeSleep()) {
      <div style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); border-radius: 16px; padding: 14px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </div>
        <div style="flex: 1; min-width: 0;">
          <p class="font-heading" style="font-size: 14px; font-weight: 700; color: white; margin: 0;">Somn în desfășurare</p>
          <p class="font-body" style="font-size: 12px; color: rgba(255,255,255,0.7); margin: 2px 0 0;">De la {{ activeSleep()!.startedAt | date:'HH:mm' }}</p>
        </div>
        <button class="touch-bounce" (click)="stopSleep()" [disabled]="stoppingSleep()"
                style="background: white; color: #7C3AED; border: none; border-radius: 12px; padding: 10px 16px; font-family: 'Nunito Sans', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer;">
          @if (stoppingSleep()) { ... } @else { Oprește }
        </button>
      </div>
    }

    <!-- 2x3 grid of log buttons -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px;">
      <button class="log-btn touch-bounce" style="background: #FFF7ED;" (click)="openSheet('feeding')">
        <div class="log-btn__icon" style="background: #FFEDD5;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
        </div>
        <span class="log-btn__label" style="color: #EA580C;">Hrănire</span>
      </button>

      <button class="log-btn touch-bounce" [style.background]="activeSleep() ? '#7C3AED' : '#F5F3FF'" (click)="activeSleep() ? stopSleep() : openSheet('sleep')">
        <div class="log-btn__icon" [style.background]="activeSleep() ? 'rgba(255,255,255,0.2)' : '#EDE9FE'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" [attr.stroke]="activeSleep() ? 'white' : '#8B5CF6'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            @if (activeSleep()) {
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            } @else {
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            }
          </svg>
        </div>
        <span class="log-btn__label" [style.color]="activeSleep() ? 'white' : '#7C3AED'">{{ activeSleep() ? 'Oprește' : 'Somn' }}</span>
      </button>

      <button class="log-btn touch-bounce" style="background: #F0FDFA;" (click)="openSheet('diaper')">
        <div class="log-btn__icon" style="background: #CCFBF1;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8"/><path d="M12 8v8"/>
          </svg>
        </div>
        <span class="log-btn__label" style="color: #0D9488;">Scutec</span>
      </button>

      <button class="log-btn touch-bounce" style="background: #EFF6FF;" (click)="openSheet('growth')">
        <div class="log-btn__icon" style="background: #DBEAFE;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <span class="log-btn__label" style="color: #2563EB;">Creștere</span>
      </button>

      <button class="log-btn touch-bounce" style="background: #FFF1F2;" (click)="openSheet('medication')">
        <div class="log-btn__icon" style="background: #FFE4E6;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-6 18.75h9"/>
          </svg>
        </div>
        <span class="log-btn__label" style="color: #E11D48;">Medicație</span>
      </button>

      <button class="log-btn touch-bounce" style="background: #FFF8F5;" (click)="openSheet('note')">
        <div class="log-btn__icon" style="background: #F5E6DE;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B7263" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <span class="log-btn__label" style="color: #8B7263;">Notă</span>
      </button>
    </div>

    <!-- ═══ BOTTOM SHEETS ═══ -->

    @if (activeSheet() === 'feeding') {
      <div class="bottom-sheet-backdrop" (click)="closeSheet()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0 0 16px;">Hrănire</h2>
        <div class="section-label">Sursă</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
          @for (src of feedingSources; track src.value) {
            <button class="source-pill" [class.source-pill--active]="selectedSource() === src.value"
                    (click)="selectedSource.set(src.value)">{{ src.label }}</button>
          }
        </div>
        <div class="section-label">Cantitate (ml)</div>
        <div class="stepper" style="margin-bottom: 16px;">
          <button class="stepper__btn" (click)="feedingMl.set(Math.max(0, feedingMl() - 10))">−</button>
          <input type="number" class="luna-input" style="width: 70px; text-align: center; font-size: 16px; font-weight: 700; padding: 6px;"
                 [value]="feedingMl()" (input)="feedingMl.set(+$any($event.target).value)" />
          <button class="stepper__btn" (click)="feedingMl.set(feedingMl() + 10)">+</button>
        </div>
        <div class="section-label">Durată (minute)</div>
        <div class="stepper" style="margin-bottom: 20px;">
          <button class="stepper__btn" (click)="feedingMin.set(Math.max(0, feedingMin() - 1))">−</button>
          <input type="number" class="luna-input" style="width: 70px; text-align: center; font-size: 16px; font-weight: 700; padding: 6px;"
                 [value]="feedingMin()" (input)="feedingMin.set(+$any($event.target).value)" />
          <button class="stepper__btn" (click)="feedingMin.set(feedingMin() + 1)">+</button>
        </div>
        <button class="btn-primary" style="width: 100%;" [disabled]="saving()" (click)="saveFeeding()">
          @if (saving()) { Se salvează... } @else { Salvează }
        </button>
      </div>
    }

    @if (activeSheet() === 'sleep') {
      <div class="bottom-sheet-backdrop" (click)="closeSheet()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0 0 16px;">Somn</h2>
        <div class="section-label">Note</div>
        <textarea class="luna-input" rows="2" placeholder="Opțional..." [value]="sleepNotes()" (input)="sleepNotes.set($any($event.target).value)" style="margin-bottom: 20px;"></textarea>
        <button class="btn-primary" style="width: 100%;" [disabled]="saving()" (click)="saveSleep()">
          @if (saving()) { Se salvează... } @else { Începe somnul }
        </button>
      </div>
    }

    @if (activeSheet() === 'diaper') {
      <div class="bottom-sheet-backdrop" (click)="closeSheet()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0 0 16px;">Scutec</h2>
        <div class="section-label">Tip</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
          @for (dt of diaperTypes; track dt.value) {
            <button class="source-pill" [class.source-pill--active]="selectedDiaperType() === dt.value"
                    (click)="selectedDiaperType.set(dt.value)">{{ dt.label }}</button>
          }
        </div>
        <button class="btn-primary" style="width: 100%;" [disabled]="saving()" (click)="saveDiaper()">
          @if (saving()) { Se salvează... } @else { Salvează }
        </button>
      </div>
    }

    @if (activeSheet() === 'growth') {
      <div class="bottom-sheet-backdrop" (click)="closeSheet()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0 0 16px;">Creștere</h2>

        <!-- Weight -->
        <div class="growth-row" (click)="growthEditField.set('weight')">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #FFF7ED; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a9 9 0 019 9v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a9 9 0 019-9z"/>
              </svg>
            </div>
            <div>
              <p class="font-body" style="font-size: 14px; font-weight: 600; color: #3B2E26; margin: 0;">Greutate</p>
              <p class="font-body" style="font-size: 12px; color: #C4A99A; margin: 2px 0 0;">{{ growthWeight() ? growthWeight() + ' kg' : 'Apasă pentru a introduce' }}</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A99A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
        @if (growthEditField() === 'weight') {
          <div style="padding: 12px; background: #FEFCE8; border-radius: 12px; margin: -4px 0 12px;">
            <div class="section-label" style="margin-bottom: 6px;">Greutate (kg) — 3 zecimale</div>
            <input type="number" step="0.001" class="luna-input" style="font-size: 16px; font-weight: 700; text-align: center;"
                   [value]="growthWeight()" (input)="growthWeight.set(+$any($event.target).value)" placeholder="ex: 3.450" />
          </div>
        }

        <!-- Height -->
        <div class="growth-row" (click)="growthEditField.set('height')">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #F5F3FF; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M2 12h4M18 12h4M8 6l4-4 4 4M8 18l4 4 4-4"/>
              </svg>
            </div>
            <div>
              <p class="font-body" style="font-size: 14px; font-weight: 600; color: #3B2E26; margin: 0;">Înălțime</p>
              <p class="font-body" style="font-size: 12px; color: #C4A99A; margin: 2px 0 0;">{{ growthHeight() ? growthHeight() + ' cm' : 'Apasă pentru a introduce' }}</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A99A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
        @if (growthEditField() === 'height') {
          <div style="padding: 12px; background: #FEFCE8; border-radius: 12px; margin: -4px 0 12px;">
            <div class="section-label" style="margin-bottom: 6px;">Înălțime (cm)</div>
            <input type="number" step="0.1" class="luna-input" style="font-size: 16px; font-weight: 700; text-align: center;"
                   [value]="growthHeight()" (input)="growthHeight.set(+$any($event.target).value)" placeholder="ex: 52.5" />
          </div>
        }

        <!-- Head circumference -->
        <div class="growth-row" (click)="growthEditField.set('head')">
          <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #F0FDFA; display: flex; align-items: center; justify-content: center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <div>
              <p class="font-body" style="font-size: 14px; font-weight: 600; color: #3B2E26; margin: 0;">Circumferință cap</p>
              <p class="font-body" style="font-size: 12px; color: #C4A99A; margin: 2px 0 0;">{{ growthHead() ? growthHead() + ' cm' : 'Apasă pentru a introduce' }}</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A99A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
        @if (growthEditField() === 'head') {
          <div style="padding: 12px; background: #FEFCE8; border-radius: 12px; margin: -4px 0 12px;">
            <div class="section-label" style="margin-bottom: 6px;">Circumferință cap (cm)</div>
            <input type="number" step="0.1" class="luna-input" style="font-size: 16px; font-weight: 700; text-align: center;"
                   [value]="growthHead()" (input)="growthHead.set(+$any($event.target).value)" placeholder="ex: 35.0" />
          </div>
        }

        <div style="margin-top: 16px;">
          <button class="btn-primary" style="width: 100%;" [disabled]="saving()" (click)="saveGrowth()">
            @if (saving()) { Se salvează... } @else { Salvează }
          </button>
        </div>
      </div>
    }

    @if (activeSheet() === 'medication') {
      <div class="bottom-sheet-backdrop" (click)="closeSheet()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0 0 16px;">Medicație</h2>
        <div class="section-label">Nume medicament</div>
        <input class="luna-input" placeholder="ex: Paracetamol" [value]="medName()" (input)="medName.set($any($event.target).value)" style="margin-bottom: 12px;" />
        <div class="section-label">Doză</div>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <input class="luna-input" type="number" placeholder="Cantitate" [value]="medDose()" (input)="medDose.set(+$any($event.target).value)" style="flex: 1;" />
        </div>
        <div class="section-label">Unitate</div>
        <div style="display: flex; gap: 8px; margin-bottom: 20px;">
          @for (u of medUnits; track u) {
            <button class="source-pill" [class.source-pill--active]="medUnit() === u"
                    (click)="medUnit.set(u)">{{ u }}</button>
          }
        </div>
        <button class="btn-primary" style="width: 100%;" [disabled]="saving() || !medName()" (click)="saveMedication()">
          @if (saving()) { Se salvează... } @else { Salvează }
        </button>
      </div>
    }

    @if (activeSheet() === 'note') {
      <div class="bottom-sheet-backdrop" (click)="closeSheet()"></div>
      <div class="bottom-sheet">
        <div class="grab-handle"></div>
        <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0 0 16px;">Notă</h2>
        <textarea class="luna-input" rows="4" placeholder="Scrie o notă..." [value]="genericNote()" (input)="genericNote.set($any($event.target).value)" style="margin-bottom: 20px;"></textarea>
        <button class="btn-primary" style="width: 100%;" (click)="closeSheet()">Închide</button>
      </div>
    }

    @if (showToast()) {
      <div style="position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: #3B2E26; color: white; padding: 12px 24px; border-radius: 14px; font-family: 'Nunito Sans', sans-serif; font-size: 14px; font-weight: 600; z-index: 300; animation: fadeIn 0.2s ease; box-shadow: var(--shadow-elevated);">
        Salvat cu succes
      </div>
    }
  `,
  styles: [`
    .growth-row {
      display: flex;
      align-items: center;
      padding: 14px 12px;
      border-radius: 14px;
      background: rgba(245,230,222,0.2);
      margin-bottom: 8px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .growth-row:active {
      background: rgba(245,230,222,0.5);
    }
  `]
})
export class LogPageComponent {
  readonly ctx = inject(BabyContextService);
  private readonly overlay = inject(OverlayService);
  private readonly feedingService = inject(FeedingService);
  private readonly sleepService = inject(SleepService);
  private readonly diaperService = inject(DiaperService);
  private readonly growthService = inject(GrowthService);
  private readonly medicationService = inject(MedicationService);

  Math = Math;
  activeSheet = signal<string | null>(null);
  saving = signal(false);
  showToast = signal(false);
  activeSleep = signal<SleepEntry | null>(null);
  stoppingSleep = signal(false);

  feedingSources: { value: FeedingSource; label: string }[] = [
    { value: 'LeftBreast', label: 'Sân stâng' },
    { value: 'RightBreast', label: 'Sân drept' },
    { value: 'BothBreasts', label: 'Ambele' },
    { value: 'Bottle', label: 'Biberon' },
    { value: 'Formula', label: 'Formulă' },
    { value: 'Solid', label: 'Solid' },
  ];
  selectedSource = signal<FeedingSource>('Bottle');
  feedingMl = signal(0);
  feedingMin = signal(0);
  sleepNotes = signal('');
  diaperTypes = [
    { value: 'Pee' as const, label: 'Udat' },
    { value: 'Poo' as const, label: 'Murdar' },
    { value: 'Mixed' as const, label: 'Mixt' },
    { value: 'Dry' as const, label: 'Uscat' },
  ];
  selectedDiaperType = signal<'Pee' | 'Poo' | 'Mixed' | 'Dry'>('Pee');

  // Growth — manual input with clickable rows
  growthWeight = signal(0);
  growthHeight = signal(0);
  growthHead = signal(0);
  growthEditField = signal<string | null>(null);

  medName = signal('');
  medDose = signal(0);
  medUnit = signal('ml');
  medUnits = ['ml', 'mg', 'picături'];
  medNotes = signal('');
  genericNote = signal('');

  private sleepEffect = effect(() => {
    const baby = this.ctx.activeBaby();
    if (baby) this.checkActiveSleep(baby.id);
  });

  private checkActiveSleep(babyId: string) {
    this.sleepService.getAll(babyId).subscribe(items => {
      this.activeSleep.set(items.find(s => !s.endedAt) ?? null);
    });
  }

  openSheet(type: string) {
    this.activeSheet.set(type);
    this.growthEditField.set(null);
    this.overlay.show();
  }

  closeSheet() {
    this.activeSheet.set(null);
    this.growthEditField.set(null);
    this.overlay.hide();
  }

  private toast() {
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2000);
  }

  stopSleep() {
    const baby = this.ctx.activeBaby();
    const sleep = this.activeSleep();
    if (!baby || !sleep) return;
    this.stoppingSleep.set(true);
    this.sleepService.update(baby.id, sleep.id, {
      startedAt: sleep.startedAt,
      endedAt: new Date().toISOString(),
      location: sleep.location,
      notes: sleep.notes,
    }).subscribe({
      next: () => {
        this.stoppingSleep.set(false);
        this.activeSleep.set(null);
        this.toast();
      },
      error: () => this.stoppingSleep.set(false),
    });
  }

  saveFeeding() {
    const baby = this.ctx.activeBaby();
    if (!baby) return;
    this.saving.set(true);
    this.feedingService.create(baby.id, {
      occurredAt: new Date().toISOString(),
      source: this.selectedSource(),
      amountMl: this.feedingMl() || null,
      durationMinutes: this.feedingMin() || null,
    }).subscribe({
      next: () => { this.saving.set(false); this.closeSheet(); this.toast(); },
      error: () => this.saving.set(false),
    });
  }

  saveSleep() {
    const baby = this.ctx.activeBaby();
    if (!baby) return;
    this.saving.set(true);
    this.sleepService.create(baby.id, {
      startedAt: new Date().toISOString(),
      notes: this.sleepNotes() || null,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeSheet();
        this.toast();
        if (baby) this.checkActiveSleep(baby.id);
      },
      error: () => this.saving.set(false),
    });
  }

  saveDiaper() {
    const baby = this.ctx.activeBaby();
    if (!baby) return;
    this.saving.set(true);
    this.diaperService.create(baby.id, {
      occurredAt: new Date().toISOString(),
      type: this.selectedDiaperType(),
    }).subscribe({
      next: () => { this.saving.set(false); this.closeSheet(); this.toast(); },
      error: () => this.saving.set(false),
    });
  }

  saveGrowth() {
    const baby = this.ctx.activeBaby();
    if (!baby) return;
    this.saving.set(true);
    this.growthService.create(baby.id, {
      measuredAt: new Date().toISOString(),
      weightKg: this.growthWeight() || null,
      heightCm: this.growthHeight() || null,
      headCircumferenceCm: this.growthHead() || null,
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeSheet();
        this.toast();
        this.growthWeight.set(0);
        this.growthHeight.set(0);
        this.growthHead.set(0);
      },
      error: () => this.saving.set(false),
    });
  }

  saveMedication() {
    const baby = this.ctx.activeBaby();
    if (!baby) return;
    this.saving.set(true);
    this.medicationService.create(baby.id, {
      administeredAt: new Date().toISOString(),
      name: this.medName(),
      doseAmount: this.medDose() || null,
      doseUnit: this.medUnit() || null,
    }).subscribe({
      next: () => { this.saving.set(false); this.closeSheet(); this.toast(); this.medName.set(''); },
      error: () => this.saving.set(false),
    });
  }
}
