import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OverlayService {
  /** True when a bottom sheet or modal is open */
  readonly active = signal(false);

  show() { this.active.set(true); }
  hide() { this.active.set(false); }
}
