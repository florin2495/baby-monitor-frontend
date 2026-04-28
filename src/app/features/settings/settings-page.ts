import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BabyContextService, BabyService, OverlayService } from '../../core/services';
import { Baby } from '../../core/models';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1 class="font-heading" style="font-size: 22px; font-weight: 800; color: #3B2E26; margin: 0 0 4px;">Setări</h1>
    <p class="font-body" style="font-size: 13px; color: #C4A99A; margin: 0 0 24px;">Gestionează bebelușii și aplicația</p>

    <div class="section-label">Bebeluși</div>
    <div class="luna-card" style="padding: 0; overflow: hidden; margin-bottom: 16px;">
      @for (baby of ctx.babies(); track baby.id; let i = $index) {
        <div style="display: flex; align-items: center; gap: 12px; padding: 14px 16px;"
             [style.border-bottom]="i < ctx.babies().length - 1 ? '1px solid rgba(245,230,222,0.5)' : 'none'">
          <div style="width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; font-family: 'Nunito', sans-serif;"
               [style.background]="ctx.getBabyColor(i).bg"
               [style.color]="ctx.getBabyColor(i).text">
            {{ baby.name.charAt(0).toUpperCase() }}
          </div>
          <div style="flex: 1; min-width: 0;">
            <p class="font-heading" style="font-size: 15px; font-weight: 700; color: #3B2E26; margin: 0;">{{ baby.name }}</p>
            <p class="font-body" style="font-size: 12px; color: #C4A99A; margin: 2px 0 0;">{{ formatSex(baby.sex) }}</p>
          </div>
          <a [routerLink]="['/babies', baby.id, 'edit']" class="touch-bounce"
             style="width: 32px; height: 32px; border-radius: 10px; background: #EDE9FE; display: flex; align-items: center; justify-content: center; text-decoration: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </a>
          <button class="touch-bounce" (click)="confirmDelete(baby)"
                  style="width: 32px; height: 32px; border-radius: 10px; background: #FFF1F2; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
        </div>
      }
    </div>

    <a routerLink="/babies/new" class="btn-secondary touch-bounce"
       style="display: flex; width: 100%; justify-content: center; text-decoration: none; margin-bottom: 32px;">
      + Adaugă bebeluș
    </a>

    <div class="section-label">Despre</div>
    <div class="luna-card">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #8B5CF6, #A78BFA); display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </div>
        <div>
          <p class="font-heading" style="font-size: 16px; font-weight: 700; color: #3B2E26; margin: 0;">Luna</p>
          <p class="font-body" style="font-size: 12px; color: #C4A99A; margin: 0;">Baby Monitor v1.0</p>
        </div>
      </div>
      <p class="font-body" style="font-size: 13px; color: #8B7263; line-height: 1.5; margin: 0;">
        Aplicație self-hosted pentru monitorizarea activităților bebelușului. Toate datele sunt stocate pe serverul tău.
      </p>
    </div>

    @if (babyToDelete()) {
      <div class="bottom-sheet-backdrop" (click)="cancelDelete()"></div>
      <div class="bottom-sheet" style="text-align: center;">
        <div class="grab-handle"></div>
        <div style="width: 56px; height: 56px; border-radius: 16px; background: #FFF1F2; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        </div>
        <h2 class="font-heading" style="font-size: 18px; font-weight: 700; color: #3B2E26; margin: 0 0 8px;">Șterge {{ babyToDelete()!.name }}?</h2>
        <p class="font-body" style="font-size: 14px; color: #8B7263; margin: 0 0 24px;">Toate datele asociate vor fi șterse permanent.</p>
        <div style="display: flex; gap: 10px;">
          <button class="btn-secondary" style="flex: 1;" (click)="cancelDelete()">Anulează</button>
          <button class="btn-primary" style="flex: 1; background: #F43F5E;" [disabled]="deleting()" (click)="deleteBaby()">
            @if (deleting()) { Se șterge... } @else { Șterge }
          </button>
        </div>
      </div>
    }
  `,
})
export class SettingsPageComponent {
  readonly ctx = inject(BabyContextService);
  private readonly babyService = inject(BabyService);
  private readonly overlay = inject(OverlayService);

  babyToDelete = signal<Baby | null>(null);
  deleting = signal(false);

  formatSex(sex: string): string {
    return sex === 'Male' ? 'Băiat' : sex === 'Female' ? 'Fată' : 'Necunoscut';
  }

  confirmDelete(baby: Baby) {
    this.babyToDelete.set(baby);
    this.overlay.show();
  }

  cancelDelete() {
    this.babyToDelete.set(null);
    this.overlay.hide();
  }

  deleteBaby() {
    const baby = this.babyToDelete();
    if (!baby) return;
    this.deleting.set(true);
    this.babyService.delete(baby.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.cancelDelete();
        this.ctx.refresh();
      },
      error: () => this.deleting.set(false),
    });
  }
}
