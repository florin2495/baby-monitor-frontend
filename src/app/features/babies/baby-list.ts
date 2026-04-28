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
    <!-- Section header -->
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-[22px] font-bold text-[#1c1c1e] tracking-tight">Bebelusii mei</h1>
      <a routerLink="/babies/new"
         class="flex items-center justify-center w-9 h-9 rounded-full bg-[#4263eb] touch-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </a>
    </div>

    @if (loading()) {
      <div class="flex justify-center py-20">
        <div class="w-6 h-6 rounded-full border-2 border-[#4263eb] border-t-transparent animate-spin"></div>
      </div>
    } @else if (babies().length === 0) {
      <!-- Empty state -->
      <div class="flex flex-col items-center pt-16 px-6">
        <div class="w-20 h-20 rounded-full bg-[#e8eaed] flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-[#aeaeb2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
          </svg>
        </div>
        <p class="text-[15px] text-[#8e8e93] text-center mb-5">Niciun bebelus adaugat inca</p>
        <a routerLink="/babies/new"
           class="inline-flex items-center gap-2 rounded-full bg-[#4263eb] px-6 py-3 text-[15px] font-semibold text-white touch-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Adauga bebelus
        </a>
      </div>
    } @else {
      <!-- iOS grouped list -->
      <div class="rounded-2xl bg-white overflow-hidden shadow-sm">
        @for (baby of babies(); track baby.id; let last = $last) {
          <a [routerLink]="['/dashboard', baby.id]"
             class="flex items-center gap-3 px-4 py-3 touch-bounce"
             [class.border-b]="!last"
             [class.border-gray-100]="!last">
            <!-- Avatar -->
            <div class="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-[17px] font-semibold"
                 [style.background]="baby.sex === 'Female' ? '#fce4ec' : baby.sex === 'Male' ? '#e3f2fd' : '#e0f2f1'"
                 [style.color]="baby.sex === 'Female' ? '#e91e63' : baby.sex === 'Male' ? '#1976d2' : '#00897b'">
              {{ baby.name.charAt(0).toUpperCase() }}
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-[17px] font-medium text-[#1c1c1e] truncate leading-tight">{{ baby.name }}</p>
              <p class="text-[13px] text-[#8e8e93] mt-0.5">{{ baby.dateOfBirth | date:'d MMM yyyy' }}</p>
            </div>
            <!-- Chevron -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#c7c7cc] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
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
