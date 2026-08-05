import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
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
            <i class="fa-solid fa-user text-sand"></i>
            <span>Sobre mí</span>
          </a>
          <a href="#proyectos" class="nav-item">
            <i class="fa-solid fa-code text-sand"></i>
            <span>Proyectos</span>
          </a>
          <a href="#educacion" class="nav-item">
            <i class="fa-solid fa-graduation-cap text-sand"></i>
            <span>Educación</span>
          </a>
          <a href="#metricas" class="nav-item">
            <i class="fa-brands fa-github text-sand"></i>
            <span>Métricas GitHub</span>
          </a>
        </nav>

        <!-- Action & Mobile Toggle -->
        <div class="nav-actions">
          <a href="#asistente" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-comments"></i>
            <span>Hablar con IA</span>
          </a>
          <button 
            class="mobile-toggle-btn" 
            (click)="toggleMenu()"
            [attr.aria-label]="isMenuOpen() ? 'Cerrar menú' : 'Abrir menú'">
            <i class="fa-solid" [class.fa-bars]="!isMenuOpen()" [class.fa-xmark]="isMenuOpen()"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      <div class="mobile-dropdown" [class.open]="isMenuOpen()">
        <nav class="mobile-nav-list">
          <a href="#sobre-mi" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-user"></i> Sobre mí
          </a>
          <a href="#proyectos" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-code"></i> Proyectos
          </a>
          <a href="#educacion" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-graduation-cap"></i> Educación
          </a>
          <a href="#metricas" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-brands fa-github"></i> Métricas GitHub
          </a>
          <a href="#asistente" (click)="closeMenu()" class="mobile-nav-item">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Asistente IA (Gemini)
          </a>
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
      background: rgba(18, 20, 23, 0.88);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border-subtle);
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
      color: var(--text-primary);
      text-decoration: none;
    }

    .brand-bracket {
      color: var(--accent-copper-hover);
    }

    .brand-name {
      color: var(--text-primary);
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
      color: var(--text-primary);
      transform: translateY(-1px);
    }

    .ai-badge-nav {
      position: relative;
    }

    .sparkle-tag {
      font-size: 0.65rem;
      background: rgba(194, 94, 56, 0.15);
      color: var(--accent-copper-hover);
      border: 1px solid rgba(194, 94, 56, 0.3);
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-full);
      font-family: var(--font-mono);
      font-weight: 600;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    .mobile-toggle-btn {
      display: none;
      background: rgba(245, 245, 244, 0.08);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
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
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
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
