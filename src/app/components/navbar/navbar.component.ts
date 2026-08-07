import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LanguageSwitcherComponent],
  template: `
    <header class="navbar-header" [class.scrolled]="isScrolled()">
      <div class="container navbar-container">
        <!-- Brand Logo -->
        <a href="#hero" class="brand-logo">
          <span class="brand-bracket">&lt;</span>
          <span class="brand-name">Yanina</span>
          <span class="brand-tag">.Dev</span>
          <span class="brand-bracket">/&gt;</span>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a href="#sobre-mi" class="nav-item">
            <i class="fa-solid fa-user text-copper"></i>
            <span>{{ 'NAV.SOBRE_MI' | translate }}</span>
          </a>
          <a href="#proyectos" class="nav-item">
            <i class="fa-solid fa-code text-copper"></i>
            <span>{{ 'NAV.PROYECTOS' | translate }}</span>
          </a>
          <a href="#educacion" class="nav-item">
            <i class="fa-solid fa-graduation-cap text-copper"></i>
            <span>{{ 'NAV.EDUCACION' | translate }}</span>
          </a>
          <a href="#metricas" class="nav-item">
            <i class="fa-brands fa-github text-copper"></i>
            <span>{{ 'NAV.METRICAS' | translate }}</span>
          </a>
        </nav>

        <!-- Action & Mobile Toggle -->
        <div class="nav-actions">
          <app-language-switcher></app-language-switcher>

          <!-- Theme Toggle Button (Dark / Light) -->
          <button 
            type="button" 
            class="theme-toggle-btn" 
            (click)="themeService.toggleTheme()" 
            [attr.aria-label]="themeService.currentTheme() === 'dark' ? ('NAV.MODO_CLARO' | translate) : ('NAV.MODO_OSCURO' | translate)"
            [attr.title]="themeService.currentTheme() === 'dark' ? ('NAV.MODO_CLARO' | translate) : ('NAV.MODO_OSCURO' | translate)">
            <i class="fa-solid" [class.fa-sun]="themeService.currentTheme() === 'dark'" [class.fa-moon]="themeService.currentTheme() === 'light'"></i>
          </button>

          <a href="#asistente" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-comments"></i>
            <span>{{ 'NAV.HABLAR_IA' | translate }}</span>
          </a>
          
          <button 
            class="mobile-toggle-btn" 
            (click)="toggleMenu()"
            [attr.aria-label]="isMenuOpen() ? ('NAV.CERRAR_MENU' | translate) : ('NAV.ABRIR_MENU' | translate)">
            <i class="fa-solid" [class.fa-bars]="!isMenuOpen()" [class.fa-xmark]="isMenuOpen()"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <div class="mobile-dropdown" [class.open]="isMenuOpen()">
        <nav class="mobile-nav-list">
          <a href="#sobre-mi" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-user"></i> {{ 'NAV.SOBRE_MI' | translate }}
          </a>
          <a href="#proyectos" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-code"></i> {{ 'NAV.PROYECTOS' | translate }}
          </a>
          <a href="#educacion" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-graduation-cap"></i> {{ 'NAV.EDUCACION' | translate }}
          </a>
          <a href="#metricas" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-brands fa-github"></i> {{ 'NAV.METRICAS' | translate }}
          </a>
          <a href="#asistente" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-wand-magic-sparkles"></i> {{ 'NAV.ASISTENTE_IA' | translate }}
          </a>
          <div class="mobile-controls">
            <app-language-switcher></app-language-switcher>
            <button 
              type="button" 
              class="theme-toggle-btn" 
              (click)="themeService.toggleTheme()" 
              [attr.aria-label]="themeService.currentTheme() === 'dark' ? ('NAV.MODO_CLARO' | translate) : ('NAV.MODO_OSCURO' | translate)"
              [attr.title]="themeService.currentTheme() === 'dark' ? ('NAV.MODO_CLARO' | translate) : ('NAV.MODO_OSCURO' | translate)">
              <i class="fa-solid" [class.fa-sun]="themeService.currentTheme() === 'dark'" [class.fa-moon]="themeService.currentTheme() === 'light'"></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 1.25rem 0;
      background: var(--navbar-bg);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      font-family: var(--font-mono);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      text-decoration: none;
    }

    .brand-bracket {
      color: var(--accent-copper-hover);
    }

    .brand-name {
      color: var(--text-main);
    }

    .brand-tag {
      color: var(--accent-sand);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;

      i {
        font-size: 0.85rem;
      }
    }

    .nav-item:hover {
      color: var(--text-main);
      transform: translateY(-1px);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .theme-toggle-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      background: var(--btn-secondary-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      color: var(--accent-copper-hover);
      cursor: pointer;
      font-size: 1.05rem;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .theme-toggle-btn:hover {
      background: var(--accent-copper-glow);
      border-color: var(--accent-copper-hover);
      transform: rotate(15deg) scale(1.05);
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    .mobile-toggle-btn {
      display: none;
      background: var(--btn-secondary-bg);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.1rem;
    }

    .mobile-dropdown {
      display: none;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 1.5rem;
    }

    .mobile-dropdown.open {
      display: block;
    }

    .mobile-nav-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .mobile-nav-item {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;

      i {
        color: var(--accent-copper);
      }
    }

    .mobile-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-top: 0.5rem;
    }

    @media (max-width: 868px) {
      .nav-links {
        display: none;
      }
      .mobile-toggle-btn {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent {
  readonly themeService = inject(ThemeService);
  isMenuOpen = signal<boolean>(false);
  isScrolled = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 30);
      });
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
