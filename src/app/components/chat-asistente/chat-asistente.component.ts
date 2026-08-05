import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { PortfolioService } from '../../services/portfolio.service';
import { ChatMessage } from '../../models/portfolio.models';

@Component({
  selector: 'app-chat-asistente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="asistente" class="section-padding chat-section">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-tag glow-tag">
            <i class="fa-solid fa-brain text-copper"></i> Asistente Virtual Gemini
          </span>
          <h2 class="section-title">
            Asistente con <span class="text-gradient">Inteligencia Artificial</span>
          </h2>
          <p class="section-subtitle">
            ¿Eres reclutador o líder técnico? Hacele cualquier pregunta a la IA sobre la experiencia, proyectos y stack de Yanina.
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
                <h4 class="ai-title">Gemini Assistant (Spring Boot AI API)</h4>
                <div class="connection-status">
                  <span class="status-dot"></span>
                  <span>Backend http://localhost:8080 Conectado</span>
                </div>
              </div>
            </div>

            <button class="btn-clear" (click)="reiniciarChat()" title="Reiniciar conversación">
              <i class="fa-solid fa-rotate-right"></i>
            </button>
          </div>

          <!-- Quick Suggestion Buttons for Recruiters -->
          <div class="quick-suggestions-bar">
            <span class="suggestions-label"><i class="fa-solid fa-lightbulb"></i> Preguntas rápidas:</span>
            <div class="suggestions-chips">
              <button
                *ngFor="let s of sugerencias"
                (click)="enviarPreguntaRapida(s)"
                [disabled]="cargando()"
                class="chip-btn">
                {{ s }}
              </button>
            </div>
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
                  {{ msg.sender === 'assistant' ? 'Asistente de Yanina' : 'Tú (Reclutador)' }}
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
                <span class="typing-text">IA escribiendo</span>
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input Controls Bar -->
          <div class="chat-input-container">
            <form (ngSubmit)="enviarMensaje()" class="chat-form">
              <input
                type="text"
                [(ngModel)]="nuevaPregunta"
                name="nuevaPregunta"
                placeholder="Escribe tu pregunta aquí (ej. ¿Qué proyectos ha desarrollado con Spring Boot y Angular?)..."
                [disabled]="cargando()"
                class="chat-input"
                autocomplete="off" />

              <button
                type="submit"
                [disabled]="!nuevaPregunta.trim() || cargando()"
                class="btn btn-primary btn-send">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Enviar</span>
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
      background: rgba(194, 94, 56, 0.12);
      border-color: rgba(194, 94, 56, 0.3);
      color: var(--accent-copper-hover);
    }

    .chat-window-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      height: 650px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-glow);
      background: var(--bg-card);
      border-radius: var(--radius-lg);
    }

    /* Header Bar */
    .chat-header-bar {
      padding: 1.25rem 1.75rem;
      background: rgba(26, 29, 34, 0.95);
      border-bottom: 1px solid var(--border-subtle);
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
      background: linear-gradient(135deg, rgba(194, 94, 56, 0.25) 0%, rgba(245, 245, 244, 0.12) 100%);
      border: 1px solid rgba(194, 94, 56, 0.4);
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
    }

    .connection-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--accent-emerald);
    }

    .btn-clear {
      background: transparent;
      border: 1px solid var(--border-subtle);
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
        color: var(--text-primary);
        background: rgba(245, 245, 244, 0.08);
      }
    }

    /* Quick Suggestions */
    .quick-suggestions-bar {
      padding: 0.75rem 1.5rem;
      background: rgba(18, 20, 23, 0.6);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 1rem;
      overflow-x: auto;
    }

    .suggestions-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: nowrap;
      font-weight: 600;
    }

    .suggestions-chips {
      display: flex;
      gap: 0.5rem;
    }

    .chip-btn {
      background: rgba(245, 245, 244, 0.06);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.8rem;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: var(--accent-copper-hover);
        color: var(--text-primary);
        background: var(--accent-copper-glow);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    /* Chat Messages Body */
    .chat-messages-body {
      flex: 1;
      padding: 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: rgba(18, 20, 23, 0.4);
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
      background: rgba(245, 245, 244, 0.08);
      border: 1px solid var(--border-subtle);
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
      background: rgba(26, 29, 34, 0.95);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
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
      color: rgba(255, 255, 255, 0.8);
      text-align: right;
    }

    /* Markdown Body Styling - Cobre & Gris Perla */
    .markdown-body {
      color: #E2E8F0;
      font-size: 0.95rem;
      line-height: 1.6;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
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
      color: #94A3B8;
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
      background: rgba(26, 29, 34, 0.95);
      border-top: 1px solid var(--border-subtle);
    }

    .chat-form {
      display: flex;
      gap: 0.75rem;
    }

    .chat-input {
      flex: 1;
      background: rgba(18, 20, 23, 0.8);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.75rem 1.25rem;
      color: var(--text-primary);
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
    }

    @media (max-width: 768px) {
      .chat-window-container {
        height: 550px;
      }
      .message-wrapper {
        max-width: 90%;
      }
      .quick-suggestions-bar {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class ChatAsistenteComponent {
  private readonly portfolioService = inject(PortfolioService);

  @ViewChild('chatMessagesContainer') private chatContainer!: ElementRef;

  nuevaPregunta = '';
  cargando = signal<boolean>(false);

  sugerencias: string[] = [
    '¿Cuál es la experiencia de Yanina?',
    '¿Qué tecnologías maneja en backend y frontend?',
    '¿Qué características tiene el proyecto RECRED?',
    '¿Cómo puedo contactarla para una entrevista?'
  ];

  historialmensajes = signal<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '¡Hola! Soy el asistente virtual inteligente de **Yanina Dominé**. Estoy configurado para responder cualquier consulta sobre sus proyectos en **Spring Boot**, **Angular 17+**, **Supabase** y su trayectoria profesional. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);

  constructor(private sanitizer: DomSanitizer) {}

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

    // Consumir el endpoint POST http://localhost:8080/api/portfolio/chat/preguntar
    this.portfolioService.preguntarChat(texto).subscribe({
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
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Ocurrió un contratiempo temporal de red al consultar el servidor Spring Boot (http://localhost:8080/api/portfolio/chat/preguntar).',
          timestamp: new Date()
        };
        this.historialmensajes.update(prev => [...prev, errorMsg]);
        this.cargando.set(false);
        this.scrollToBottom();
      }
    });
  }

  enviarPreguntaRapida(pregunta: string) {
    this.nuevaPregunta = pregunta;
    this.enviarMensaje();
  }

  reiniciarChat() {
    this.historialmensajes.set([
      {
        id: Date.now().toString(),
        sender: 'assistant',
        text: 'Conversación reiniciada. ¿Qué otra duda tienes sobre el perfil de **Yanina**?',
        timestamp: new Date()
      }
    ]);
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
