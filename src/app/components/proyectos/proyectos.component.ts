import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { PortfolioService } from '../../services/portfolio.service';
import { Proyecto } from '../../models/portfolio.models';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section id="proyectos" class="section-padding proyectos-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag">
            <i class="fa-solid fa-code-commit text-copper"></i> {{ 'PROYECTOS.TAG' | translate }}
          </span>
          <h2 class="section-title">
            {{ 'PROYECTOS.TITULO' | translate }} <span class="text-gradient">{{ 'PROYECTOS.TITULO_HIGHLIGHT' | translate }}</span>
          </h2>
          <p class="section-subtitle">
            {{ 'PROYECTOS.SUBTITULO' | translate }}
          </p>
        </div>

        <!-- Loading State -->
        <div *ngIf="cargando()" class="loading-container">
          <div class="spinner"></div>
          <p class="text-mono">{{ 'PROYECTOS.CARGANDO' | translate }}</p>
          <small class="text-muted" style="display: block; margin-top: 0.5rem;">
            {{ 'PROYECTOS.CARGANDO_AVISO' | translate }}
          </small>
        </div>

        <!-- Error / Empty State -->
        <div *ngIf="!cargando() && proyectos().length === 0" class="empty-state glass-panel">
          <i class="fa-solid fa-folder-open empty-icon"></i>
          <p>{{ 'PROYECTOS.SIN_PROYECTOS' | translate }}</p>
        </div>

        <!-- Projects Grid -->
        <div *ngIf="!cargando() && proyectos().length > 0" class="projects-grid">
          <div 
            *ngFor="let p of proyectos()" 
            class="project-card glass-panel"
            [class.featured]="p.destacado">
            
            <!-- Featured Tag -->
            <div *ngIf="p.destacado" class="card-featured-badge">
              <i class="fa-solid fa-star"></i> {{ 'PROYECTOS.DESTACADO' | translate }}
            </div>

            <!-- Card Header -->
            <div class="card-header">
              <div class="icon-wrapper">
                <i class="fa-solid" [ngClass]="getProjectIcon(p.titulo)"></i>
              </div>
              <div class="header-text">
                <h3 class="project-title">
                  {{ p.key ? ('PROJECTS.' + p.key + '.TITLE' | translate) : p.titulo }}
                </h3>
                <p class="project-summary">
                  {{ p.key ? ('PROJECTS.' + p.key + '.SUMMARY' | translate) : p.resumen }}
                </p>
              </div>
            </div>

            <!-- Card Description -->
            <div class="card-body">
              <p class="project-desc">
                {{ p.key ? ('PROJECTS.' + p.key + '.DESC' | translate) : p.descripcion }}
              </p>

              <!-- Technologies List -->
              <div class="project-techs">
                <span *ngFor="let tech of p.tecnologias" class="tech-chip">
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- Card Footer Links -->
            <div class="card-footer">
              <a 
                [href]="p.githubUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-secondary btn-sm flex-1">
                <i class="fa-brands fa-github"></i>
                <span>{{ 'PROYECTOS.REPOSITORIO' | translate }}</span>
              </a>

              <a 
                *ngIf="p.deployUrl" 
                [href]="p.deployUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-primary btn-sm flex-1">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>{{ 'PROYECTOS.VER_DEMO' | translate }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .proyectos-section {
      position: relative;
    }

    .loading-container {
      text-align: center;
      padding: 4rem 0;
      color: var(--text-secondary);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(194, 94, 56, 0.2);
      border-top-color: var(--accent-copper-hover);
      border-radius: 50%;
      margin: 0 auto 1.5rem auto;
      animation: spin 1s infinite linear;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 2rem;
    }

    .project-card {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .project-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-hover);
      box-shadow: var(--shadow-card);
    }

    .project-card.featured {
      border: 1px solid var(--accent-copper);
      background: var(--bg-card);
    }

    .card-featured-badge {
      position: absolute;
      top: -12px;
      right: 20px;
      background: linear-gradient(135deg, var(--accent-copper) 0%, #a04725 100%);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      box-shadow: 0 4px 10px rgba(194, 94, 56, 0.35);
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      background: var(--accent-copper-glow);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-copper-hover);
      font-size: 1.4rem;
      flex-shrink: 0;
    }

    .project-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: var(--text-main);
    }

    .project-summary {
      color: var(--text-secondary);
      font-size: 0.88rem;
      font-weight: 500;
    }

    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: 1.75rem;
    }

    .project-desc {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .project-techs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .tech-chip {
      background: var(--btn-secondary-bg);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-size: 0.78rem;
      font-family: var(--font-mono);
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-sm);
    }

    .card-footer {
      display: flex;
      gap: 0.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-color);
    }

    .flex-1 {
      flex: 1;
    }

    @media (max-width: 768px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProyectosComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  proyectos = signal<Proyecto[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.cargando.set(true);
    this.portfolioService.getProyectos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  getProjectIcon(titulo: string): string {
    const t = titulo.toLowerCase();
    if (t.includes('recred')) return 'fa-award';
    if (t.includes('invitaci')) return 'fa-envelope-open-text';
    if (t.includes('backend') || t.includes('api')) return 'fa-server';
    return 'fa-laptop-code';
  }
}
