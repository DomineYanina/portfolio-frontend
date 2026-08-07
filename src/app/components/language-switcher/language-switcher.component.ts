import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="lang-switcher-container" role="region" aria-label="Selección de idioma">
      <button 
        type="button" 
        class="lang-btn" 
        [class.active]="currentLang() === 'es'" 
        (click)="switchLanguage('es')"
        title="Español"
        aria-label="Cambiar a idioma Español">
        <span class="lang-flag">🇪🇸</span>
        <span class="lang-code">ES</span>
      </button>

      <span class="lang-divider">|</span>

      <button 
        type="button" 
        class="lang-btn" 
        [class.active]="currentLang() === 'en'" 
        (click)="switchLanguage('en')"
        title="English"
        aria-label="Switch to English language">
        <span class="lang-flag">🇬🇧</span>
        <span class="lang-code">EN</span>
      </button>
    </div>
  `,
  styles: [`
    .lang-switcher-container {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.6rem;
      background: var(--btn-secondary-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      backdrop-filter: blur(8px);
      transition: all 0.25s ease;
    }

    .lang-switcher-container:hover {
      border-color: var(--border-hover);
      background: var(--btn-secondary-hover);
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 500;
      padding: 0.2rem 0.45rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
    }

    .lang-btn:hover {
      color: var(--text-main);
    }

    .lang-btn.active {
      background: linear-gradient(135deg, var(--accent-copper) 0%, #a04725 100%);
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(194, 94, 56, 0.35);
    }

    .lang-flag {
      font-size: 0.9rem;
      line-height: 1;
    }

    .lang-code {
      letter-spacing: 0.05em;
    }

    .lang-divider {
      color: var(--border-color);
      font-size: 0.75rem;
      user-select: none;
    }
  `]
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly translate = inject(TranslateService);

  currentLang = signal<string>('es');

  ngOnInit(): void {
    let savedLang = 'es';
    if (typeof window !== 'undefined' && window.localStorage) {
      savedLang = localStorage.getItem('portfolio_lang') || 'es';
    }
    this.currentLang.set(savedLang);
    this.translate.use(savedLang);
  }

  switchLanguage(lang: string): void {
    if (this.currentLang() === lang) return;

    this.currentLang.set(lang);
    this.translate.use(lang);

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('portfolio_lang', lang);
    }
  }
}
