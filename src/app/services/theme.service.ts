import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal<Theme>('dark');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    let savedTheme: Theme = 'dark';
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('portfolio_theme') as Theme;
      if (stored === 'light' || stored === 'dark') {
        savedTheme = stored;
      }
    }
    this.applyTheme(savedTheme);
  }

  toggleTheme(): void {
    const nextTheme: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }

  private applyTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    if (typeof window !== 'undefined') {
      if (theme === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
      if (window.localStorage) {
        localStorage.setItem('portfolio_theme', theme);
      }
    }
  }
}
