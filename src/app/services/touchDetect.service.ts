import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class TouchDetectService {
  private isTouchDeviceSignal = signal<boolean>('ontouchstart' in document.documentElement);
  readonly isTouchDevice = this.isTouchDeviceSignal.asReadonly();
}