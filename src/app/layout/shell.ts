import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Top bar -->
    <header class="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 h-14">
      <a routerLink="/" class="text-xl font-bold text-luna-700 tracking-tight">Luna</a>
    </header>

    <!-- Main content -->
    <main class="pb-20 px-4 pt-4 max-w-lg mx-auto">
      <router-outlet />
    </main>

    <!-- Bottom nav (mobile-first) -->
    <nav class="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 flex justify-around items-center h-16 safe-bottom">
      <a routerLink="/babies"
         routerLinkActive="text-luna-600"
         class="flex flex-col items-center gap-0.5 text-gray-500 text-xs py-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
        <span>Bebelusi</span>
      </a>

      <a routerLink="/dashboard"
         routerLinkActive="text-luna-600"
         class="flex flex-col items-center gap-0.5 text-gray-500 text-xs py-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
        <span>Dashboard</span>
      </a>

      <a routerLink="/timeline"
         routerLinkActive="text-luna-600"
         class="flex flex-col items-center gap-0.5 text-gray-500 text-xs py-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span>Timeline</span>
      </a>
    </nav>
  `,
  styles: [`
    .safe-bottom {
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
  `],
})
export class ShellComponent {}
