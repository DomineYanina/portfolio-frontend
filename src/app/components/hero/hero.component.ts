import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section id="hero" class="hero-section section-padding">
      <div class="container hero-container">
        <!-- Main Content Column -->
        <div class="hero-content">
          <!-- Availability Badge -->
          <div class="badge-status">
            <span class="status-dot"></span>
            <span>{{ 'HERO.DISPONIBLE' | translate }}</span>
          </div>

          <!-- Main Heading -->
          <h1 class="hero-title">
            {{ 'HERO.SALUDO' | translate }} <span class="text-gradient">Yanina Dominé</span>
          </h1>
          <h2 class="hero-subtitle">
            {{ 'HERO.ROL' | translate }} <span class="highlight-copper">{{ 'HERO.ROL_HIGHLIGHT' | translate }}</span>
          </h2>

          <!-- Bio Pitch -->
          <p class="hero-bio" [innerHTML]="'HERO.BIO' | translate"></p>

          <!-- Tech Stack Chips -->
          <div class="tech-stack-container">
            <span class="tech-label"><i class="fa-solid fa-layer-group"></i> {{ 'HERO.STACK_LABEL' | translate }}</span>
            <div class="tech-badges">
              <span class="tech-badge java"><i class="fa-brands fa-java"></i> Java 17</span>
              <span class="tech-badge spring"><i class="fa-solid fa-leaf"></i> Spring Boot</span>
              <span class="tech-badge angular"><i class="fa-brands fa-angular"></i> Angular 17+</span>
              <span class="tech-badge docker"><i class="fa-brands fa-docker"></i> Docker</span>
              <span class="tech-badge aws"><i class="fa-brands fa-aws"></i> AWS</span>
              <span class="tech-badge supabase"><i class="fa-solid fa-bolt"></i> Supabase</span>
              <span class="tech-badge postgres"><i class="fa-solid fa-database"></i> PostgreSQL</span>
              <span class="tech-badge ts"><i class="fa-brands fa-js"></i> TypeScript</span>
              <span class="tech-badge js"><i class="fa-brands fa-square-js"></i> JavaScript</span>
              <span class="tech-badge html"><i class="fa-brands fa-html5"></i> HTML5</span>
            </div>
          </div>

          <!-- CTAs -->
          <div class="hero-ctas">
            <a href="#proyectos" class="btn btn-primary">
              <i class="fa-solid fa-diagram-project"></i>
              <span>{{ 'HERO.CTA_PROYECTOS' | translate }}</span>
            </a>
            <a href="#asistente" class="btn btn-outline">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>{{ 'HERO.CTA_ASISTENTE' | translate }}</span>
            </a>
            <a href="https://github.com/DomineYanina" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <i class="fa-brands fa-github"></i>
              <span>{{ 'HERO.CTA_GITHUB' | translate }}</span>
            </a>
          </div>
        </div>

        <!-- Right Side / Visual Terminal Code Card -->
        <div class="hero-visual">
          <div class="terminal-card glass-panel">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="terminal-title">developer-profile.ts</span>
            </div>
            <div class="terminal-body text-mono">
              <p><span class="code-keyword">const</span> <span class="code-variable">developer</span> = &#123;</p>
              <p class="indent-1"><span class="code-property">{{ 'CODE_SNIPPET.NOMBRE_KEY' | translate }}</span>: <span class="code-string">'{{ 'CODE_SNIPPET.NOMBRE_VAL' | translate }}'</span>,</p>
              <p class="indent-1"><span class="code-property">{{ 'CODE_SNIPPET.ROL_KEY' | translate }}</span>: <span class="code-string">'{{ 'CODE_SNIPPET.ROL_VAL' | translate }}'</span>,</p>
              <p class="indent-1"><span class="code-property">backend</span>: [<span class="code-string">'Java 17'</span>, <span class="code-string">'Spring Boot'</span>, <span class="code-string">'PostgreSQL'</span>, <span class="code-string">'Docker'</span>],</p>
              <p class="indent-1"><span class="code-property">frontend</span>: [<span class="code-string">'Angular 17+'</span>, <span class="code-string">'TypeScript'</span>, <span class="code-string">'JavaScript'</span>, <span class="code-string">'HTML5/CSS'</span>],</p>
              <p class="indent-1"><span class="code-property">cloudInfra</span>: [<span class="code-string">'AWS'</span>, <span class="code-string">'Supabase'</span>],</p>
              <p class="indent-1"><span class="code-property">{{ 'CODE_SNIPPET.PROYECTOS_KEY' | translate }}</span>: [<span class="code-string">'{{ 'CODE_SNIPPET.PROYECTO_1' | translate }}'</span>, <span class="code-string">'{{ 'CODE_SNIPPET.PROYECTO_2' | translate }}'</span>],</p>
              <p class="indent-1"><span class="code-property">iaIntegration</span>: <span class="code-string">'Google Gemini API'</span>,</p>
              <p class="indent-1"><span class="code-property">{{ 'CODE_SNIPPET.ESTADO_KEY' | translate }}</span>: <span class="code-string">'{{ 'CODE_SNIPPET.ESTADO_VAL' | translate }}'</span></p>
              <p>&#125;;</p>
              <div class="terminal-cursor-line">
                <span class="code-prompt">&gt;</span> <span class="code-cmd">Yanina.getPortfolioInfo();</span>
                <span class="blinking-cursor">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      padding-top: 9rem;
      position: relative;
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1.2fr 0.9fr;
      gap: 3rem;
      align-items: center;
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 1rem;
      background: var(--accent-emerald-glow);
      border: 1px solid var(--accent-emerald);
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      color: var(--accent-emerald);
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .hero-title {
      font-size: 3.25rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 0.25rem;
      color: var(--text-main);
    }

    .hero-subtitle {
      font-size: 1.75rem;
      color: var(--text-secondary);
      font-weight: 600;
      margin-bottom: 1.25rem;
    }

    .highlight-copper {
      color: var(--accent-copper-hover);
    }

    .hero-bio {
      color: var(--text-secondary);
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
      max-width: 620px;

      strong {
        color: var(--text-main);
      }
    }

    .tech-stack-container {
      margin-bottom: 2.25rem;
    }

    .tech-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .tech-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .tech-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-main);
      transition: all 0.2s ease;

      i {
        font-size: 0.9rem;
      }
    }

    .tech-badge.java i { color: #f89820; }
    .tech-badge.spring i { color: #6db33f; }
    .tech-badge.angular i { color: #dd0031; }
    .tech-badge.docker i { color: #2496ed; }
    .tech-badge.aws i { color: #ff9900; }
    .tech-badge.supabase i { color: #3ecf8e; }
    .tech-badge.postgres i { color: #64b5f6; }
    .tech-badge.ts i { color: var(--accent-copper-hover); }
    .tech-badge.js i { color: #f7df1e; }
    .tech-badge.html i { color: #e34c26; }

    .hero-ctas {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    /* Terminal Visual */
    .terminal-card {
      overflow: hidden;
      box-shadow: var(--shadow-card);
      background: #1a1d22;
      border: 1px solid var(--border-color);
    }

    .terminal-header {
      background: #121417;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .terminal-dots {
      display: flex;
      gap: 0.4rem;
    }

    .dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }
    .dot.red { background: #c25e38; }
    .dot.yellow { background: #e5a93c; }
    .dot.green { background: #34d399; }

    .terminal-title {
      font-size: 0.8rem;
      color: #94A3B8;
      font-family: var(--font-mono);
    }

    .terminal-body {
      padding: 1.5rem;
      font-size: 0.9rem;
      line-height: 1.6;
      background: #1a1d22;
      color: #E2E8F0;

      .indent-1 {
        padding-left: 1.5rem;
      }
    }

    .code-keyword { color: #D97706; }
    .code-variable { color: #F5F5F4; }
    .code-property { color: #d68763; }
    .code-string { color: #93c5fd; }
    .code-prompt { color: #D97706; font-weight: bold; }
    .code-cmd { color: #E2E8F0; }

    .terminal-cursor-line {
      margin-top: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .blinking-cursor {
      color: #D97706;
      font-weight: bold;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    @media (max-width: 992px) {
      .hero-container {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 2.5rem;
      }
    }
  `]
})
export class HeroComponent {}
