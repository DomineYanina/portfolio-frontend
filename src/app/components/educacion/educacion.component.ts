import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Educacion } from '../../models/portfolio.models';

@Component({
  selector: 'app-educacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="educacion" class="section-padding educacion-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag">
            <i class="fa-solid fa-graduation-cap text-copper"></i> Trayectoria & Estudios
          </span>
          <h2 class="section-title">
            Formación <span class="text-gradient">Académica</span>
          </h2>
        </div>

        <!-- Loading State -->
        <div *ngIf="cargando()" class="loading-container">
          <div class="spinner"></div>
          <p class="text-mono">Cargando formación académica desde Spring Boot (GET /api/portfolio/educacion)...</p>
        </div>

        <!-- Timeline / Cards List -->
        <div *ngIf="!cargando() && educacionList().length > 0" class="timeline-container">
          <div *ngFor="let item of educacionList()" class="timeline-item glass-panel">
            
            <!-- Timeline Marker Icon -->
            <div class="timeline-icon-box">
              <i class="fa-solid fa-university"></i>
            </div>

            <!-- Content Card -->
            <div class="timeline-content">
              <div class="content-header">
                <div class="institution-meta">
                  <h3 class="degree-title">{{ item.titulo }}</h3>
                  <h4 class="institution-name text-sand">
                    <i class="fa-solid fa-location-dot"></i> {{ item.institucion }}
                  </h4>
                </div>
                <div class="period-badge text-mono">
                  <i class="fa-regular fa-calendar-days"></i> {{ item.periodo }}
                </div>
              </div>

              <p class="education-desc">
                {{ item.descripcion }}
              </p>

              <div class="education-highlights">
                <span class="highlight-chip"><i class="fa-solid fa-check"></i> Desarrollo Web Full Stack</span>
                <span class="highlight-chip"><i class="fa-solid fa-check"></i> Programación Orientada a Objetos</span>
                <span class="highlight-chip"><i class="fa-solid fa-check"></i> Bases de Datos Relacionales</span>
                <span class="highlight-chip"><i class="fa-solid fa-check"></i> Metodologías Ágiles</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!cargando() && educacionList().length === 0" class="empty-state glass-panel">
          <i class="fa-solid fa-graduation-cap empty-icon"></i>
          <p>No se registraron datos de formación académica.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .educacion-section {
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

    .timeline-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
    }

    .timeline-item {
      display: flex;
      gap: 1.75rem;
      padding: 2rem;
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      box-sizing: border-box;
    }

    .timeline-item:hover {
      transform: translateY(-3px);
      border-color: var(--border-hover);
      box-shadow: 0 12px 30px rgba(194, 94, 56, 0.15);
    }

    .timeline-icon-box {
      width: 54px;
      height: 54px;
      background: linear-gradient(135deg, rgba(194, 94, 56, 0.2) 0%, rgba(245, 245, 244, 0.08) 100%);
      border: 1px solid rgba(194, 94, 56, 0.35);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-copper-hover);
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .timeline-content {
      flex: 1;
      min-width: 0;
    }

    .content-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .institution-meta {
      min-width: 0;
      flex: 1;
    }

    .degree-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .institution-name {
      font-size: 0.95rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.4rem;

      i {
        font-size: 0.85rem;
        color: var(--accent-copper-hover);
      }
    }

    .period-badge {
      background: rgba(194, 94, 56, 0.12);
      border: 1px solid rgba(194, 94, 56, 0.3);
      color: var(--accent-copper-hover);
      font-size: 0.82rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .education-desc {
      color: var(--text-secondary);
      font-size: 0.98rem;
      line-height: 1.65;
      margin-bottom: 1.25rem;
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .education-highlights {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .highlight-chip {
      background: rgba(245, 245, 244, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.8rem;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;

      i {
        color: var(--accent-emerald);
        font-size: 0.75rem;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);

      .empty-icon {
        font-size: 2.5rem;
        color: var(--text-muted);
        margin-bottom: 1rem;
      }
    }

    @media (max-width: 640px) {
      .timeline-item {
        flex-direction: column;
        gap: 1rem;
      }
      .content-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class EducacionComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  educacionList = signal<Educacion[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit() {
    this.cargarEducacion();
  }

  cargarEducacion() {
    this.cargando.set(true);
    this.portfolioService.getEducacion().subscribe({
      next: (data) => {
        this.educacionList.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }
}
