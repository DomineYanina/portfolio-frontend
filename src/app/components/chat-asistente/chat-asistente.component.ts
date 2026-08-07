import { Component, ElementRef, ViewChild, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { marked } from 'marked';
import { PortfolioService } from '../../services/portfolio.service';
import { ChatMessage, CategoriaPreguntas } from '../../models/portfolio.models';

@Component({
  selector: 'app-chat-asistente',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <section id="asistente" class="section-padding chat-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag glow-tag">
            <i class="fa-solid fa-brain text-copper"></i> {{ 'CHAT.TAG' | translate }}
          </span>
          <h2 class="section-title">
            {{ 'CHAT.TITULO' | translate }} <span class="text-gradient">{{ 'CHAT.TITULO_HIGHLIGHT' | translate }}</span>
          </h2>
          <p class="section-subtitle">
            {{ 'CHAT.SUBTITLE' | translate }}
          </p>
        </div>

        <!-- Chat Main Window Container -->
        <div class="chat-window-container glass-panel">
          <!-- Chat Header Bar -->
          <div class="chat-header-bar">
            <div class="ai-avatar-status">
              <div class="ai-avatar">
                <i class="fa-solid fa-robot"></i>
              </div>
              <div class="ai-info">
                <h4 class="ai-title">{{ 'CHAT.HEADER_TITLE' | translate }}</h4>
                <div class="connection-status">
                  <span class="status-dot"></span>
                  <span>{{ 'CHAT.ESTADO_CONECTADO' | translate }}</span>
                </div>
              </div>
            </div>

            <button class="btn-clear" (click)="reiniciarChat()" [attr.title]="'CHAT.REINICIAR_TOOLTIP' | translate">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
          </div>

          <!-- Messages Scrollable Body Area -->
          <div #chatMessagesContainer class="chat-messages-body">
            <div
              *ngFor="let msg of historialmensajes()"
              class="message-wrapper"
              [ngClass]="msg.sender">

              <!-- Sender Avatar -->
              <div class="message-avatar">
                <i *ngIf="msg.sender === 'assistant'" class="fa-solid fa-robot text-copper"></i>
                <i *ngIf="msg.sender === 'user'" class="fa-solid fa-user-tie text-sand"></i>
              </div>

              <!-- Message Content Bubble -->
              <div class="message-bubble">
                <div class="message-sender-name">
                  {{ msg.sender === 'assistant' ? ('CHAT.SENDER_BOT' | translate) : ('CHAT.SENDER_USER' | translate) }}
                </div>
                
                <!-- Rendered Markdown HTML Container -->
                <div class="message-text markdown-body" [innerHTML]="renderMarkdown(msg.text)"></div>

                <div class="message-timestamp">
                  {{ msg.timestamp | date:'HH:mm' }}
                </div>
              </div>
            </div>

            <!-- Loading Indicator Typing Bubble -->
            <div *ngIf="cargando()" class="message-wrapper assistant loading">
              <div class="message-avatar">
                <i class="fa-solid fa-robot text-copper"></i>
              </div>
              <div class="message-bubble typing-bubble">
                <span class="typing-text">{{ 'CHAT.CARGANDO_BOT' | translate }}</span>
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Categorized Suggestions Bar (Positioned directly above text input form) -->
          @if (mostrarSugerencias()) {
            <div class="quick-suggestions-bar">
              @if (categoriaSeleccionada() === null) {
                <div class="suggestions-chips">
                  <button
                    *ngFor="let cat of categorias"
                    (click)="seleccionarCategoria(cat)"
                    [disabled]="cargando()"
                    type="button"
                    class="chip-btn category-chip">
                    <i [class]="cat.icono"></i>
                    <span>{{ cat.tituloKey | translate }}</span>
                  </button>
                </div>
              } @else {
                <div class="suggestions-chips questions-container">
                  <button
                    (click)="seleccionarCategoria(null)"
                    type="button"
                    class="chip-btn btn-back">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>{{ 'CHAT.VOLVER' | translate }}</span>
                  </button>
                  <div class="questions-list">
                    <button
                      *ngFor="let pKey of categoriaSeleccionada()!.preguntasKeys"
                      (click)="enviarPreguntaRapida(pKey)"
                      [disabled]="cargando()"
                      type="button"
                      class="chip-btn question-chip">
                      {{ pKey | translate }}
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Chat Input Controls Bar -->
          <div class="chat-input-container">
            <form (ngSubmit)="enviarMensaje()" class="chat-form">
              <!-- Toggle suggestions button -->
              <button
                type="button"
                (click)="toggleSugerencias()"
                class="btn-toggle-suggestions"
                [class.active]="mostrarSugerencias()"
                [attr.title]="'CHAT.PREGUNTAS_RAPIDAS' | translate">
                <i class="fa-solid fa-lightbulb"></i>
              </button>

              <input
                type="text"
                [(ngModel)]="nuevaPregunta"
                name="nuevaPregunta"
                [placeholder]="'CHAT.PLACEHOLDER_INPUT' | translate"
                [disabled]="cargando()"
                class="chat-input"
                autocomplete="off" />

              <button
                type="submit"
                [disabled]="!nuevaPregunta.trim() || cargando()"
                class="btn btn-primary btn-send">
                <i class="fa-solid fa-paper-plane"></i>
                <span>{{ 'CHAT.BOTON_ENVIAR' | translate }}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .chat-section {
      position: relative;
    }

    .glow-tag {
      background: var(--accent-copper-glow);
      border-color: var(--border-color);
      color: var(--accent-copper-hover);
    }

    .chat-window-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      height: 650px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-glow);
      background: var(--bg-card);
      border-radius: var(--radius-lg);
    }

    /* Header Bar */
    .chat-header-bar {
      padding: 1.25rem 1.75rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ai-avatar-status {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .ai-avatar {
      width: 44px;
      height: 44px;
      background: var(--accent-copper-glow);
      border: 1px solid var(--border-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-copper-hover);
      font-size: 1.2rem;
    }

    .ai-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--accent-emerald);
    }

    .btn-clear {
      background: var(--btn-secondary-bg);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-main);
        background: var(--btn-secondary-hover);
      }
    }

    /* Quick Suggestions Bar */
    .quick-suggestions-bar {
      padding: 0.85rem 1.5rem;
      background: var(--bg-surface);
      border-top: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      box-sizing: border-box;
      flex-shrink: 0;
      animation: fadeIn 0.25s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .suggestions-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      align-items: center;
      width: 100%;
    }

    .questions-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.65rem;
      width: 100%;
    }

    .questions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      flex: 1;
    }

    .chip-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      font-size: 0.85rem;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-full);
      white-space: normal;
      text-align: left;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover:not(:disabled) {
        border-color: var(--accent-copper-hover);
        color: var(--text-main);
        background: var(--accent-copper-glow);
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .category-chip {
      font-weight: 600;
      background: var(--bg-card);
      border-color: var(--border-color);
      color: var(--text-main);

      i {
        color: var(--accent-copper-hover);
        font-size: 0.95rem;
      }

      &:hover:not(:disabled) {
        border-color: var(--accent-copper-hover);
        background: var(--accent-copper-glow);
      }
    }

    .btn-back {
      background: var(--btn-secondary-bg);
      border-color: var(--border-color);
      color: var(--accent-copper-hover);
      font-weight: 600;
      flex-shrink: 0;

      &:hover:not(:disabled) {
        background: var(--accent-copper-glow);
        color: var(--text-main);
        border-color: var(--accent-copper-hover);
      }
    }

    .question-chip {
      font-size: 0.82rem;
      line-height: 1.35;
    }

    /* Chat Messages Body */
    .chat-messages-body {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: var(--bg-main);
    }

    .message-wrapper {
      display: flex;
      gap: 1rem;
      max-width: 80%;
    }

    .message-wrapper.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-wrapper.assistant {
      align-self: flex-start;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--btn-secondary-bg);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 0.95rem;
    }

    .message-bubble {
      padding: 0.9rem 1.25rem;
      border-radius: var(--radius-md);
      position: relative;
    }

    .message-wrapper.assistant .message-bubble {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-top-left-radius: 2px;
    }

    .message-wrapper.user .message-bubble {
      background: linear-gradient(135deg, var(--accent-copper) 0%, #a04725 100%);
      color: #ffffff;
      border-top-right-radius: 2px;
    }

    .message-sender-name {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-bottom: 0.25rem;
      font-weight: 600;
    }

    .message-wrapper.user .message-sender-name {
      color: rgba(255, 255, 255, 0.85);
      text-align: right;
    }

    /* Markdown Body Styling */
    .markdown-body {
      color: var(--text-main);
      font-size: 0.95rem;
      line-height: 1.6;
      font-family: var(--font-sans);
    }
    .markdown-body p {
      margin-bottom: 0.75rem;
    }
    .markdown-body p:last-child {
      margin-bottom: 0;
    }
    .markdown-body strong {
      color: var(--accent-copper-hover);
      font-weight: 600;
    }
    .markdown-body ul {
      margin: 0.5rem 0 0.75rem 1.25rem;
      padding: 0;
      list-style-type: disc;
    }
    .markdown-body li {
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
    }

    .message-wrapper.user .markdown-body {
      color: #ffffff;
    }
    .message-wrapper.user .markdown-body strong {
      color: #ffffff;
    }

    .message-timestamp {
      font-size: 0.7rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
      text-align: right;
    }

    .message-wrapper.user .message-timestamp {
      color: rgba(255, 255, 255, 0.7);
    }

    /* Typing Dots */
    .typing-bubble {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .typing-text {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-family: var(--font-mono);
    }

    .typing-dots {
      display: flex;
      gap: 0.3rem;

      span {
        width: 6px;
        height: 6px;
        background: var(--accent-copper-hover);
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
      }

      span:nth-child(1) { animation-delay: 0s; }
      span:nth-child(2) { animation-delay: 0.2s; }
      span:nth-child(3) { animation-delay: 0.4s; }
    }

    @keyframes typing {
      0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* Input Bar */
    .chat-input-container {
      padding: 1.25rem 1.5rem;
      background: var(--bg-surface);
      border-top: 1px solid var(--border-color);
    }

    .chat-form {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .btn-toggle-suggestions {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        color: var(--accent-copper-hover);
        border-color: var(--accent-copper-hover);
        background: var(--accent-copper-glow);
      }

      &.active {
        background: var(--accent-copper-glow);
        color: var(--accent-copper-hover);
        border-color: var(--accent-copper-hover);
        box-shadow: 0 0 0 2px var(--accent-copper-glow);
      }
    }

    .chat-input {
      flex: 1;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem 1.25rem;
      color: var(--text-main);
      font-size: 0.95rem;
      font-family: var(--font-sans);
      outline: none;
      transition: all 0.2s ease;

      &:focus {
        border-color: var(--accent-copper-hover);
        box-shadow: 0 0 0 3px var(--accent-copper-glow);
      }
    }

    .btn-send {
      padding: 0.75rem 1.5rem;
      height: 44px;
    }

    @media (max-width: 768px) {
      .chat-window-container {
        height: 600px;
      }
      .message-wrapper {
        max-width: 90%;
      }
      .quick-suggestions-bar {
        padding: 0.75rem 1rem;
      }
      .questions-container {
        flex-direction: column;
        align-items: flex-start;
      }
      .questions-list {
        width: 100%;
      }
    }
  `]
})
export class ChatAsistenteComponent implements OnInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioService);
  private readonly translate = inject(TranslateService);
  private langSub!: Subscription;

  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;

  nuevaPregunta = '';
  cargando = signal<boolean>(false);

  mostrarSugerencias = signal<boolean>(false);
  categoriaSeleccionada = signal<CategoriaPreguntas | null>(null);

  categorias: CategoriaPreguntas[] = [
    {
      id: 'experiencia',
      tituloKey: 'CHAT.CATEGORIAS.EXPERIENCIA.TITULO',
      icono: 'fa-solid fa-user-tie',
      preguntasKeys: [
        'CHAT.CATEGORIAS.EXPERIENCIA.P1',
        'CHAT.CATEGORIAS.EXPERIENCIA.P2',
        'CHAT.CATEGORIAS.EXPERIENCIA.P3'
      ]
    },
    {
      id: 'proyectos',
      tituloKey: 'CHAT.CATEGORIAS.PROYECTOS.TITULO',
      icono: 'fa-solid fa-folder-code',
      preguntasKeys: [
        'CHAT.CATEGORIAS.PROYECTOS.P1',
        'CHAT.CATEGORIAS.PROYECTOS.P2',
        'CHAT.CATEGORIAS.PROYECTOS.P3'
      ]
    },
    {
      id: 'metricas_contacto',
      tituloKey: 'CHAT.CATEGORIAS.METRICAS_CONTACTO.TITULO',
      icono: 'fa-solid fa-chart-line',
      preguntasKeys: [
        'CHAT.CATEGORIAS.METRICAS_CONTACTO.P1',
        'CHAT.CATEGORIAS.METRICAS_CONTACTO.P2'
      ]
    }
  ];

  historialmensajes = signal<ChatMessage[]>([]);

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.cargarTextosTraducidos();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.cargarTextosTraducidos();
    });
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  toggleSugerencias(): void {
    this.mostrarSugerencias.update(prev => !prev);
  }

  seleccionarCategoria(categoria: CategoriaPreguntas | null): void {
    this.categoriaSeleccionada.set(categoria);
  }

  private cargarTextosTraducidos(): void {
    this.translate.get('CHAT.MENSAJE_INICIAL').subscribe(msg => {
      const currentMsgs = this.historialmensajes();
      if (currentMsgs.length === 0 || (currentMsgs.length === 1 && currentMsgs[0].sender === 'assistant')) {
        this.historialmensajes.set([
          {
            id: '1',
            sender: 'assistant',
            text: msg,
            timestamp: new Date()
          }
        ]);
      }
    });
  }

  renderMarkdown(texto: string): SafeHtml {
    if (!texto) return '';
    const htmlUnsafe = marked.parse(texto) as string;
    return this.sanitizer.bypassSecurityTrustHtml(htmlUnsafe);
  }

  enviarMensaje() {
    const texto = this.nuevaPregunta.trim();
    if (!texto || this.cargando()) return;

    // Agregar mensaje del usuario
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: texto,
      timestamp: new Date()
    };

    this.historialmensajes.update(prev => [...prev, userMsg]);
    this.nuevaPregunta = '';
    this.cargando.set(true);
    this.scrollToBottom();

    // Obtener idioma activo del TranslateService (signal en ngx-translate v18)
    const rawLang = typeof this.translate.currentLang === 'function' 
      ? this.translate.currentLang() 
      : (this.translate.currentLang as unknown as string);
    const currentLang = rawLang || 'es';

    // Consumir el endpoint POST http://localhost:8080/api/portfolio/chat/preguntar
    this.portfolioService.preguntarChat(texto, currentLang).subscribe({
      next: (res) => {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.respuesta || 'Respuesta generada correctamente por la IA.',
          timestamp: new Date()
        };
        this.historialmensajes.update(prev => [...prev, assistantMsg]);
        this.cargando.set(false);
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error al consultar chat:', err);
        const errorText = this.translate.instant('CHAT.MENSAJE_ERROR');
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: errorText,
          timestamp: new Date()
        };
        this.historialmensajes.update(prev => [...prev, errorMsg]);
        this.cargando.set(false);
        this.scrollToBottom();
      }
    });
  }

  enviarPreguntaRapida(keyOrText: string) {
    const textoTraducido = this.translate.instant(keyOrText);
    this.nuevaPregunta = textoTraducido || keyOrText;
    this.enviarMensaje();
  }

  reiniciarChat() {
    this.mostrarSugerencias.set(false);
    this.categoriaSeleccionada.set(null);
    this.translate.get('CHAT.MENSAJE_REINICIADO').subscribe(text => {
      this.historialmensajes.set([
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: text,
          timestamp: new Date()
        }
      ]);
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.chatContainer) {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
        }
      } catch (err) {
        console.warn('Scroll error', err);
      }
    }, 100);
  }
}



