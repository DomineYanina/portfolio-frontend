import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { GithubMetrics } from '../../models/portfolio.models';

@Component({
  selector: 'app-github-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="metricas" class="section-padding github-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag">
            <i class="fa-brands fa-github"></i> Integración Backend API
          </span>
          <h2 class="section-title">
            Métricas de <span class="text-gradient">GitHub</span>
          </h2>
          <p class="section-subtitle">
            Estadísticas en tiempo real sincronizadas a través del microservicio Spring Boot con la API REST de GitHub.
          </p>
        </div>

        <!-- Loading -->
        <div *ngIf="cargando()" class="loading-container">
          <div class="spinner"></div>
          <p class="text-mono">Obteniendo métricas sincronizadas de GitHub...</p>
        </div>

        <!-- Metrics Visual Panel -->
        <div *ngIf="!cargando() && metrics()" class="metrics-dashboard">
          
          <!-- Top Stats Header Card -->
          <div class="profile-header-card glass-panel">
            <div class="profile-info">
              <div class="avatar-box">
                <i class="fa-brands fa-github avatar-icon"></i>
              </div>
              <div class="profile-text">
                <h3 class="username">&#64;{{ metrics()?.username }}</h3>
                <p class="profile-role">Desarrolladora Full Stack | Open Source</p>
              </div>
            </div>

            <!-- Quick Metrics Badges -->
            <div class="stats-counters">
              <div class="stat-box">
                <span class="stat-value text-gradient">{{ metrics()?.publicRepos }}</span>
                <span class="stat-label">Repos Publicados</span>
              </div>
              <div class="stat-box">
                <span class="stat-value text-copper">{{ metrics()?.starsCount || '24+' }}</span>
                <span class="stat-label">Estrellas Recibidas</span>
              </div>
            </div>

            <!-- Profile Action Button -->
            <div class="profile-action">
              <a 
                [href]="metrics()?.profileUrl" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-outline">
                <i class="fa-brands fa-github"></i>
                <span>Ver Perfil Oficial</span>
              </a>
            </div>
          </div>

          <!-- Recent Repos Grid -->
          <div class="repos-section-title">
            <h4><i class="fa-solid fa-code-fork text-copper"></i> Repositorios Destacados Recientes</h4>
          </div>

          <div class="repos-grid">
            <div *ngFor="let repo of metrics()?.recentRepos" class="repo-card glass-panel">
              <div class="repo-header">
                <a [href]="repo.htmlUrl" target="_blank" rel="noopener noreferrer" class="repo-name">
                  <i class="fa-solid fa-book-bookmark text-sand"></i>
                  <span>{{ repo.name }}</span>
                </a>
                <span class="repo-stars">
                  <i class="fa-solid fa-star text-copper"></i> {{ repo.stars }}
                </span>
              </div>

              <p class="repo-desc">{{ repo.description }}</p>

              <div class="repo-footer">
                <span class="repo-lang text-mono">
                  <span class="lang-dot" [ngClass]="getLanguageDotClass(repo.language)"></span>
                  {{ repo.language }}
                </span>

                <a [href]="repo.htmlUrl" target="_blank" rel="noopener noreferrer" class="repo-link">
                  <span>Explorar</span> <i class="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .github-section {
      background: radial-gradient(circle at 80% 20%, rgba(194, 94, 56, 0.08) 0%, transparent 50%);
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

    .profile-header-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem;
      margin-bottom: 3rem;
      gap: 2rem;
      flex-wrap: wrap;
      background: var(--bg-card);
      border-radius: var(--radius-md);
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .avatar-box {
      width: 60px;
      height: 60px;
      background: rgba(194, 94, 56, 0.1);
      border: 1px solid var(--border-subtle);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-icon {
        font-size: 2rem;
        color: var(--text-primary);
      }
    }

    .username {
      font-size: 1.4rem;
      font-weight: 700;
    }

    .profile-role {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .stats-counters {
      display: flex;
      gap: 2.5rem;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      font-family: var(--font-mono);
      line-height: 1.1;
    }

    .stat-label {
      color: var(--text-muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }

    .repos-section-title {
      margin-bottom: 1.5rem;

      h4 {
        font-size: 1.15rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }
    }

    .repos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .repo-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: var(--bg-card);
      border-radius: var(--radius-md);
      transition: all 0.25s ease;
    }

    .repo-card:hover {
      transform: translateY(-3px);
      border-color: var(--border-hover);
    }

    .repo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .repo-name {
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.05rem;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);

      &:hover {
        color: var(--accent-copper-hover);
      }
    }

    .repo-stars {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-family: var(--font-mono);
    }

    .repo-desc {
      color: var(--text-secondary);
      font-size: 0.88rem;
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }

    .repo-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.82rem;
    }

    .repo-lang {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-muted);
    }

    .lang-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94A3B8;
    }

    .lang-dot.typescript { background: #3178c6; }
    .lang-dot.java { background: #f89820; }
    .lang-dot.javascript { background: #f7df1e; }
    .lang-dot.html { background: #e34c26; }

    .repo-link {
      color: var(--accent-copper-hover);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    @media (max-width: 768px) {
      .profile-header-card {
        flex-direction: column;
        align-items: flex-start;
      }
      .stats-counters {
        width: 100%;
        justify-content: space-around;
      }
    }
  `]
})
export class GithubMetricsComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);

  metrics = signal<GithubMetrics | null>(null);
  cargando = signal<boolean>(true);

  ngOnInit() {
    this.cargarMetricas();
  }

  cargarMetricas() {
    this.cargando.set(true);
    this.portfolioService.getGithubMetrics().subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  getLanguageDotClass(lang: string): string {
    if (!lang) return '';
    return lang.toLowerCase();
  }
}
