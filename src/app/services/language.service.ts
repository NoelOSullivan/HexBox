import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
    

  private languageSignal = signal<string>(navigator.language || 'en');

  readonly currentLanguage = this.languageSignal.asReadonly();

  constructor() {
    
    // effect(() => {
    //   localStorage.setItem('lang', this.languageSignal());
    // });
  }

  setLanguage(lang: string): void {
    this.languageSignal.set(lang);
  }
}