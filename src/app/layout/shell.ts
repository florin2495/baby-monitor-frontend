import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BabyContextService, OverlayService } from '../core/services';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Header with baby switcher -->
    <header class="shell-header" [style.display]="overlay.active() ? 'none' : ''">
      <div class="header-inner">
        @if (ctx.babies().length > 0) {
          <div class="baby-pills">
            @for (baby of ctx.babies(); track baby.id; let i = $index) {
              <button
                class="baby-pill"
                [class.baby-pill--active]="i === ctx.activeIndex()"
                [class.baby-pill--inactive]="i !== ctx.activeIndex()"
                (click)="ctx.switchBaby(i)">
                {{ baby.name }}
              </button>
            }
            <a routerLink="/babies/new" class="baby-pill baby-pill--add">+</a>
          </div>
        } @else {
          <span class="header-logo">Luna</span>
        }
      </div>
    </header>

    <!-- Scrollable content -->
    <main class="shell-content scroll-area">
      <div class="content-inner">
        <router-outlet />
      </div>
    </main>

    <!-- 5-tab bar — hidden when overlay active -->
    @if (!overlay.active()) {
      <nav class="tab-bar">
        <a routerLink="/home" routerLinkActive="tab-active" class="tab-item touch-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span class="tab-label">Acasă</span>
        </a>

        <a routerLink="/log" routerLinkActive="tab-active" class="tab-item touch-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span class="tab-label">Log</span>
        </a>

        <a routerLink="/timeline" routerLinkActive="tab-active" class="tab-item touch-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="tab-label">Istoric</span>
        </a>

        <a routerLink="/charts" routerLinkActive="tab-active" class="tab-item touch-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span class="tab-label">Grafice</span>
        </a>

        <a routerLink="/settings" routerLinkActive="tab-active" class="tab-item touch-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tab-icon">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span class="tab-label">Setări</span>
        </a>
      </nav>
    }
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      height: -webkit-fill-available;
      min-height: 0;
      background: #FEFCFB;
      overflow: hidden;
    }

    .shell-header {
      flex-shrink: 0;
      background: rgba(254, 252, 251, 0.85);
      backdrop-filter: saturate(180%) blur(20px);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
      border-bottom: 0.5px solid #F5E6DE;
      padding-top: env(safe-area-inset-top, 0px);
      z-index: 100;
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      padding: 0 16px;
    }

    .header-logo {
      font-family: 'Nunito', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #8B5CF6;
      letter-spacing: -0.3px;
    }

    .baby-pills {
      display: flex;
      gap: 8px;
      align-items: center;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding: 4px 0;
    }
    .baby-pills::-webkit-scrollbar { display: none; }

    .baby-pill--add {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FFF8F5;
      color: #C4A99A;
      border: 1.5px dashed #F5E6DE;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
    }

    .shell-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 0;
    }

    .content-inner {
      padding: 16px 20px;
      padding-left: max(20px, env(safe-area-inset-left, 0px));
      padding-right: max(20px, env(safe-area-inset-right, 0px));
      padding-bottom: 24px;
      max-width: 428px;
      margin: 0 auto;
    }

    .tab-bar {
      flex-shrink: 0;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      background: rgba(255, 248, 245, 0.95);
      backdrop-filter: saturate(180%) blur(20px);
      -webkit-backdrop-filter: saturate(180%) blur(20px);
      border-top: 0.5px solid #F5E6DE;
      padding: 8px 0;
      padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
      z-index: 100;
    }

    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 2px 8px;
      text-decoration: none;
      color: #C4A99A;
      transition: color 0.2s ease;
      min-width: 48px;
    }

    .tab-item.tab-active {
      color: #8B5CF6;
    }

    .tab-icon {
      width: 22px;
      height: 22px;
    }

    .tab-label {
      font-family: 'Nunito Sans', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
  `],
})
export class ShellComponent implements OnInit {
  readonly ctx = inject(BabyContextService);
  readonly overlay = inject(OverlayService);

  ngOnInit() {
    this.ctx.loadBabies();
  }
}
