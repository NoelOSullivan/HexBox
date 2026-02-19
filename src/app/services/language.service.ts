import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageSignal = signal<string>('en');

  readonly currentLanguage = this.languageSignal.asReadonly();

  setLanguage(lang: string): void {
    this.languageSignal.set(lang);
  }
}