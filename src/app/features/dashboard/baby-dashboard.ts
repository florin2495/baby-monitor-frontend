import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Baby, FeedingEntry, SleepEntry, DiaperEntry } from '../../core/models';
import { BabyService, FeedingService, SleepService, DiaperService } from '../../core/services';
import { QuickLogComponent } from './quick-log';

@Component({
  selector: 'app-baby-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, QuickLogComponent],
  template: `
    <div class="mb-4">
      <a routerLink="/dashboard" class="text-sm text-luna-600 hover:text-luna-800 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Inapoi
      </a>
    </div>

    @if (baby(); as b) {
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
             [class]="b.sex === 'Female' ? 'bg-baby-pink text-pink-600' : b.sex === 'Male' ? 'bg-baby-blue text-blue-600' : 'bg-baby-mint text-teal-600'">
          {{ b.name.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ b.name }}</h1>
          <p class="text-sm text-gray-500">Nascut {{ b.dateOfBirth | date:'d MMMM yyyy' }}</p>
        </div>
        <a [routerLink]="['/babies', b.id, 'edit']"
           class="ml-auto text-gray-400 hover:text-luna-600 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </a>
      </div>

      <!-- Quick-log buttons -->
      <app-quick-log [babyId]="b.id" (logged)="refresh()" />

      <!-- Recent activity cards -->
      <div class="mt-6 space-y-4">
        <!-- Last feeding -->
        <div class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Ultima hranire</h3>
          @if (lastFeeding(); as f) {
            <p class="text-gray-900 font-medium">{{ f.source }} · {{ f.occurredAt | date:'HH:mm' }}</p>
            @if (f.amountMl) { <p class="text-sm text-gray-500">{{ f.amountMl }} ml</p> }
            @if (f.durationMinutes) { <p class="text-sm text-gray-500">{{ f.durationMinutes }} min</p> }
          } @else {
            <p class="text-sm text-gray-400">Nicio inregistrare</p>
          }
        </div>

        <!-- Last sleep -->
        <div class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Ultimul somn</h3>
          @if (lastSleep(); as s) {
            <p class="text-gray-900 font-medium">{{ s.startedAt | date:'HH:mm' }}
              @if (s.endedAt) { — {{ s.endedAt | date:'HH:mm' }} }
              @else { <span class="text-luna-600 text-sm">(in desfasurare)</span> }
            </p>
            @if (s.location) { <p class="text-sm text-gray-500">{{ s.location }}</p> }
          } @else {
            <p class="text-sm text-gray-400">Nicio inregistrare</p>
          }
        </div>

        <!-- Last diaper -->
        <div class="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <h3 class="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Ultimul scutec</h3>
          @if (lastDiaper(); as d) {
            <p class="text-gray-900 font-medium">{{ d.type }} · {{ d.occurredAt | date:'HH:mm' }}</p>
          } @else {
            <p class="text-sm text-gray-400">Nicio inregistrare</p>
          }
        </div>
      </div>
    }
  `,
})
export class BabyDashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly babyService = inject(BabyService);
  private readonly feedingService = inject(FeedingService);
  private readonly sleepService = inject(SleepService);
  private readonly diaperService = inject(DiaperService);

  baby = signal<Baby | null>(null);
  lastFeeding = signal<FeedingEntry | null>(null);
  lastSleep = signal<SleepEntry | null>(null);
  lastDiaper = signal<DiaperEntry | null>(null);

  private babyId = '';

  ngOnInit() {
    this.babyId = this.route.snapshot.paramMap.get('babyId')!;
    this.refresh();
  }

  refresh() {
    this.babyService.getById(this.babyId).subscribe((b) => this.baby.set(b));
    this.feedingService.getAll(this.babyId).subscribe((items) => this.lastFeeding.set(items[0] ?? null));
    this.sleepService.getAll(this.babyId).subscribe((items) => this.lastSleep.set(items[0] ?? null));
    this.diaperService.getAll(this.babyId).subscribe((items) => this.lastDiaper.set(items[0] ?? null));
  }
}
