import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Baby } from '../../core/models';
import { BabyService } from '../../core/services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

    @if (babies().length === 0) {
      <p class="text-gray-500">Adauga un bebelus mai intai pentru a vedea dashboard-ul.</p>
    } @else {
      <div class="grid gap-3">
        @for (baby of babies(); track baby.id) {
          <a [routerLink]="['/dashboard', baby.id]"
             class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                 [class]="baby.sex === 'Female' ? 'bg-baby-pink text-pink-600' : baby.sex === 'Male' ? 'bg-baby-blue text-blue-600' : 'bg-baby-mint text-teal-600'">
              {{ baby.name.charAt(0).toUpperCase() }}
            </div>
            <span class="font-medium text-gray-900">{{ baby.name }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-auto w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </a>
        }
      </div>
    }
  `,
})
export class DashboardComponent implements OnInit {
  private readonly babyService = inject(BabyService);
  babies = signal<Baby[]>([]);

  ngOnInit() {
    this.babyService.getAll().subscribe((data) => this.babies.set(data));
  }
}
