import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <footer class="footer-section">
      <div class="container">
        <div class="footer-grid">
          
          <!-- Column 1: Brand & Bio -->
          <div class="footer-col brand-col">
            <a href="#hero" class="footer-brand">
              <span class="brand-bracket">&lt;</span>
              <span>Yanina</span>
              <span class="text-sand">.Dev</span>
              <span class="brand-bracket">/&gt;</span>
            </a>
            <p class="footer-bio">
              {{ 'FOOTER.BIO' | translate }}
            </p>
            <div class="backend-badge">
              <span class="status-dot"></span>
              <span>{{ 'FOOTER.BACKEND_ACTIVE' | translate }}</span>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-col">
            <h4 class="footer-title">{{ 'FOOTER.NAV_TITULO' | translate }}</h4>
            <ul class="footer-links">
              <li><a href="#hero"><i class="fa-solid fa-angle-right"></i> {{ 'FOOTER.INICIO' | translate }}</a></li>
              <li><a href="#sobre-mi"><i class="fa-solid fa-angle-right"></i> {{ 'NAV.SOBRE_MI' | translate }}</a></li>
              <li><a href="#proyectos"><i class="fa-solid fa-angle-right"></i> {{ 'NAV.PROYECTOS' | translate }}</a></li>
              <li><a href="#educacion"><i class="fa-solid fa-angle-right"></i> {{ 'NAV.EDUCACION' | translate }}</a></li>
              <li><a href="#metricas"><i class="fa-solid fa-angle-right"></i> {{ 'NAV.METRICAS' | translate }}</a></li>
              <li><a href="#asistente"><i class="fa-solid fa-angle-right"></i> {{ 'NAV.ASISTENTE_IA' | translate }}</a></li>
            </ul>
          </div>

          <!-- Column 3: Stack -->
          <div class="footer-col">
            <h4 class="footer-title">{{ 'FOOTER.TECH_TITULO' | translate }}</h4>
            <ul class="footer-links text-mono">
              <li><span class="tech-item"><i class="fa-brands fa-java text-orange"></i> Java 17 / Spring</span></li>
              <li><span class="tech-item"><i class="fa-brands fa-angular text-red"></i> Angular 17+</span></li>
              <li><span class="tech-item"><i class="fa-brands fa-docker text-blue"></i> Docker & AWS</span></li>
              <li><span class="tech-item"><i class="fa-brands fa-js text-yellow"></i> JS / TS / HTML5</span></li>
              <li><span class="tech-item"><i class="fa-solid fa-bolt text-emerald"></i> Supabase</span></li>
              <li><span class="tech-item"><i class="fa-solid fa-wand-magic-sparkles text-copper"></i> Gemini AI</span></li>
            </ul>
          </div>

          <!-- Column 4: Contact & Socials -->
          <div class="footer-col">
            <h4 class="footer-title">{{ 'FOOTER.CONNECT_TITULO' | translate }}</h4>
            <p class="contact-desc">{{ 'FOOTER.CONNECT_DESC' | translate }}</p>
            <div class="social-links">
              <a href="https://github.com/DomineYanina" target="_blank" rel="noopener noreferrer" class="social-btn" title="GitHub">
                <i class="fa-brands fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/domineyaninaelizabeth/" target="_blank" rel="noopener noreferrer" class="social-btn" title="LinkedIn">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="mailto:domineyanina@hotmail.com" class="social-btn" title="Enviar Email">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>

        </div>

        <!-- Bottom Copyright Bar -->
        <div class="footer-bottom">
          <p>© {{ currentYear }} Yanina Dominé. {{ 'FOOTER.RIGHTS' | translate }}</p>
          <p class="footer-subtext text-mono">{{ 'FOOTER.SUBTEXT' | translate }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-section {
      background: #0e1013;
      border-top: 1px solid var(--border-subtle);
      padding: 4.5rem 0 2rem 0;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }

    .footer-brand {
      font-family: var(--font-mono);
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-primary);
      text-decoration: none;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .brand-bracket {
      color: var(--accent-copper-hover);
    }

    .footer-bio {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .backend-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.78rem;
      color: var(--accent-emerald);
      font-family: var(--font-mono);
      background: rgba(52, 211, 153, 0.08);
      border: 1px solid rgba(52, 211, 153, 0.2);
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
    }

    .footer-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      li a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 0.88rem;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;

        i {
          font-size: 0.75rem;
          color: var(--accent-sand);
        }

        &:hover {
          color: var(--text-primary);
          transform: translateX(4px);
        }
      }

      .tech-item {
        color: var(--text-secondary);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
    }

    .text-orange { color: #f89820; }
    .text-green { color: #6db33f; }
    .text-red { color: #dd0031; }
    .text-emerald { color: #3ecf8e; }
    .text-copper { color: var(--accent-copper-hover); }
    .text-blue { color: #2496ed; }
    .text-yellow { color: #f7df1e; }

    .contact-desc {
      color: var(--text-secondary);
      font-size: 0.88rem;
      margin-bottom: 1rem;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-btn {
      width: 40px;
      height: 40px;
      background: rgba(245, 245, 244, 0.08);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: all 0.25s ease;
      font-size: 1.1rem;

      &:hover {
        background: var(--accent-copper);
        border-color: var(--accent-copper);
        transform: translateY(-3px);
        box-shadow: 0 4px 12px var(--accent-copper-glow);
      }
    }

    .footer-bottom {
      border-top: 1px solid var(--border-subtle);
      padding-top: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 0.85rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .footer-subtext {
      font-size: 0.78rem;
    }

    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 576px) {
      .footer-grid {
        grid-template-columns: 1fr;
      }
      .footer-bottom {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
