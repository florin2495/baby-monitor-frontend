import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline',
  standalone: true,
  template: `
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Timeline</h1>
    <div class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      <p class="text-gray-500">Timeline-ul va fi disponibil in curand.</p>
      <p class="text-sm text-gray-400 mt-1">Aici vei vedea toate evenimentele in ordine cronologica.</p>
    </div>
  `,
})
export class TimelineComponent {}
