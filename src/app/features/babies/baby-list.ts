import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Baby } from '../../core/models';
import { BabyService } from '../../core/services';

@Component({
  selector: 'app-baby-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Bebelusii mei</h1>
      <a routerLink="/babies/new"
         class="inline-flex items-center gap-1.5 rounded-xl bg-luna-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-luna-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Adauga
      </a>
    </div>

    @if (loading()) {
      <div class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-luna-600 border-t-transparent"></div>
      </div>
    } @else if (babies().length === 0) {
      <div class="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
        </svg>
        <p class="text-gray-500 mb-4">Nu ai adaugat niciun bebelus inca.</p>
        <a routerLink="/babies/new"
           class="inline-flex items-center gap-1.5 rounded-xl bg-luna-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-luna-700 transition">
          Adauga primul bebelus
        </a>
      </div>
    } @else {
      <div class="grid gap-3">
        @for (baby of babies(); track baby.id) {
          <a [routerLink]="['/dashboard', baby.id]"
             class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
            <!-- Avatar -->
            <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                 [class]="baby.sex === 'Female' ? 'bg-baby-pink text-pink-600' : baby.sex === 'Male' ? 'bg-baby-blue text-blue-600' : 'bg-baby-mint text-teal-600'">
              {{ baby.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 truncate">{{ baby.name }}</p>
              <p class="text-sm text-gray-500">Nascut {{ baby.dateOfBirth | date:'d MMM yyyy' }}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        }
      </div>
    }
  `,
})
export class BabyListComponent implements OnInit {
  private readonly babyService = inject(BabyService);

  babies = signal<Baby[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.babyService.getAll().subscribe({
      next: (data) => {
        this.babies.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
