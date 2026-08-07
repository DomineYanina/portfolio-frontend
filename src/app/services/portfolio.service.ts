import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Proyecto,
  Educacion,
  GithubMetrics,
  ChatPreguntaRequest,
  ChatRespuestaResponse
} from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Obtiene la lista de proyectos desde el backend Spring Boot.
   * Endpoint: GET http://localhost:8080/api/portfolio/proyectos
   */
  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.baseUrl}/proyectos`).pipe(
      catchError((error) => {
        console.warn('Backend Spring Boot no alcanzable. Usando proyectos locales de respaldo.', error);
        return of(this.getProyectosFallback());
      })
    );
  }

  /**
   * Obtiene la formación académica / educación desde el backend Spring Boot.
   * Endpoint: GET http://localhost:8080/api/portfolio/educacion
   */
  getEducacion(): Observable<Educacion[]> {
    return this.http.get<Educacion[]>(`${this.baseUrl}/educacion`).pipe(
      catchError((error) => {
        console.warn('Backend Spring Boot no alcanzable. Usando formación académica local de respaldo.', error);
        return of(this.getEducacionFallback());
      })
    );
  }

  /**
   * Obtiene estadísticas y repositorios de GitHub desde el backend.
   * Endpoint: GET http://localhost:8080/api/portfolio/metrics/github
   */
  getGithubMetrics(): Observable<GithubMetrics> {
    return this.http.get<GithubMetrics>(`${this.baseUrl}/metrics/github`).pipe(
      catchError((error) => {
        console.warn('Backend Spring Boot no alcanzable. Usando métricas locales de respaldo.', error);
        return of(this.getGithubMetricsFallback());
      })
    );
  }

  /**
   * Envía una consulta al Chatbot asistido por IA (Gemini).
   * Endpoint: POST http://localhost:8080/api/portfolio/chat/preguntar
   * Body: { "pregunta": string, "language": string }
   */
  preguntarChat(pregunta: string, language: string = 'es'): Observable<ChatRespuestaResponse> {
    const body: ChatPreguntaRequest = { pregunta, language };
    return this.http.post<ChatRespuestaResponse | string>(`${this.baseUrl}/chat/preguntar`, body).pipe(
      map(res => {
        if (typeof res === 'string') {
          return { respuesta: res };
        }
        return res;
      }),
      catchError((error) => {
        console.warn('Backend Spring Boot no alcanzable. Generando respuesta simulada de IA.', error);
        return of({ respuesta: this.generarRespuestaFallback(pregunta, language) });
      })
    );
  }

  /**
   * Datos de respaldo para Proyectos (RECRED, Invitación Digital)
   */
  private getProyectosFallback(): Proyecto[] {
    return [
      {
        id: 1,
        key: 'recred',
        titulo: 'RECRED',
        resumen: 'Plataforma de gestión de acreditaciones y créditos académicos.',
        descripcion: 'Sistema web robusto diseñado para la administración integral de acreditaciones, créditos y certificados académicos. Desarrollado con backend modular en Java 17 / Spring Boot, arquitectura RESTful, persistencia con PostgreSQL / Supabase, e interfaz reactiva construida en Angular.',
        tecnologias: ['Java 17', 'Spring Boot', 'Angular', 'Supabase', 'PostgreSQL', 'TypeScript', 'CSS Grid'],
        githubUrl: 'https://github.com/DomineYanina/recred',
        deployUrl: 'https://recred-demo.vercel.app',
        destacado: true
      },
      {
        id: 2,
        key: 'invitacion',
        titulo: 'Invitación Digital',
        resumen: 'Plataforma interactiva para la creación y gestión de eventos sociales.',
        descripcion: 'Aplicación web dinámica para invitaciones digitales personalizables con confirmación de asistencia (RSVP) en tiempo real, integración de mapa de ubicación, cuenta regresiva, galería interactiva y reproductor de música.',
        tecnologias: ['Angular 17+', 'Spring Boot', 'TypeScript', 'CSS Moderno', 'Supabase', 'REST API'],
        githubUrl: 'https://github.com/DomineYanina/invitacion-digital',
        deployUrl: 'https://invitacion-digital.vercel.app',
        destacado: true
      },
      {
        id: 3,
        key: 'portfolio-backend',
        titulo: 'Portfolio API Backend',
        resumen: 'Microservicio en Spring Boot con integración de IA (Gemini API).',
        descripcion: 'Backend de arquitectura limpia en Java 17 y Spring Boot que provee los endpoints para métricas de GitHub, administración de proyectos e integración con la API de Google Gemini para respuesta automatizada a reclutadores.',
        tecnologias: ['Java 17', 'Spring Boot 3', 'Spring AI / Gemini API', 'Maven', 'Lombok'],
        githubUrl: 'https://github.com/DomineYanina/portfolio-backend',
        deployUrl: 'https://github.com/DomineYanina/portfolio-backend',
        destacado: false
      }
    ];
  }

  /**
   * Datos de respaldo para Formación Académica
   */
  private getEducacionFallback(): Educacion[] {
    return [
      {
        id: 1,
        key: 'unlam',
        institucion: 'Universidad Nacional de La Matanza (UNLaM)',
        titulo: 'Tecnicatura Universitaria en Desarrollo Web',
        periodo: '2021 - 2026',
        descripcion: 'Formación superior enfocada en desarrollo web, bases de datos relacionales, programación orientada a objetos y metodologías ágiles.'
      }
    ];
  }

  /**
   * Datos de respaldo para Métricas de GitHub
   */
  private getGithubMetricsFallback(): GithubMetrics {
    return {
      username: 'DomineYanina',
      profileUrl: 'https://github.com/DomineYanina',
      publicRepos: 18,
      followers: 12,
      starsCount: 24,
      recentRepos: [
        {
          name: 'recred',
          key: 'RECRED',
          description: 'Sistema de Acreditaciones y Gestión de Créditos Académicos (Spring Boot + Angular).',
          htmlUrl: 'https://github.com/DomineYanina/recred',
          stars: 8,
          language: 'TypeScript'
        },
        {
          name: 'invitacion-digital',
          key: 'INVITACION_DIGITAL',
          description: 'Plataforma interactiva de invitaciones con confirmación RSVP en tiempo real.',
          htmlUrl: 'https://github.com/DomineYanina/invitacion-digital',
          stars: 6,
          language: 'TypeScript'
        },
        {
          name: 'portfolio-backend',
          key: 'PORTFOLIO_BACKEND',
          description: 'REST API en Spring Boot con integración de Gemini AI y métricas de GitHub.',
          htmlUrl: 'https://github.com/DomineYanina/portfolio-backend',
          stars: 5,
          language: 'Java'
        },
        {
          name: 'portfolio-frontend',
          key: 'PORTFOLIO_FRONTEND',
          description: 'Aplicación Angular 17+ Standalone con diseño Developer Dark Mode.',
          htmlUrl: 'https://github.com/DomineYanina/portfolio-frontend',
          stars: 5,
          language: 'TypeScript'
        }
      ]
    };
  }

  /**
   * Simulación de respuesta de IA cuando el backend no está disponible
   */
  private generarRespuestaFallback(pregunta: string, language: string = 'es'): string {
    const isEn = language === 'en';
    const p = pregunta.toLowerCase();
    if (p.includes('tecnología') || p.includes('stack') || p.includes('herramienta') || p.includes('tech') || p.includes('skills')) {
      return isEn
        ? 'Yanina masters a Full Stack tech stack focused on Java 17, Spring Boot (Spring Security, Spring Data JPA, REST APIs), Angular 17+ (Standalone components, RxJS, Signals), Supabase/PostgreSQL, and TypeScript.'
        : 'Yanina domina un stack Full Stack enfocado en Java 17, Spring Boot (Spring Security, Spring Data JPA, REST APIs), Angular 17+ (Standalone components, RxJS, Signals), Supabase/PostgreSQL y TypeScript.';
    } else if (p.includes('experiencia') || p.includes('sobre mí') || p.includes('perfil') || p.includes('educación') || p.includes('unlam') || p.includes('experience') || p.includes('education') || p.includes('about')) {
      return isEn
        ? 'Yanina holds a degree in University Web Development from the National University of La Matanza (UNLaM). She has experience building complete applications from backend architecture to modern reactive interfaces.'
        : 'Yanina se recibió de la Tecnicatura Universitaria en Desarrollo Web en la Universidad Nacional de La Matanza (UNLaM). Además, cuenta con experiencia construyendo aplicaciones completas desde la arquitectura backend hasta interfaces reactivas modernas.';
    } else if (p.includes('proyecto') || p.includes('recred') || p.includes('invitaci') || p.includes('project')) {
      return isEn
        ? 'Her main projects include RECRED (Academic credit and school buffet management platform) and Digital Invitation. Both projects use Angular on the frontend and Spring Boot on the backend integrated with Supabase.'
        : 'Sus proyectos principales incluyen RECRED (Sistema de Acreditaciones y billetera digital para kioscos escolares) e Invitación Digital. Ambos proyectos utilizan Angular en el frontend y Spring Boot en el backend con integración a Supabase.';
    } else if (
      p.includes('contacto') || p.includes('contactar') || p.includes('entrevista') || 
      p.includes('email') || p.includes('mail') || p.includes('correo') || 
      p.includes('linkedin') || p.includes('contratar') || p.includes('escribir') ||
      p.includes('hablar') || p.includes('reunion') || p.includes('reunión') ||
      p.includes('contact') || p.includes('interview') || p.includes('hire')
    ) {
      return isEn
        ? 'You can contact Yanina to schedule an interview via her professional LinkedIn profile or by sending an email. She is fully available for new professional opportunities!'
        : 'Puedes contactar a Yanina para coordinar una entrevista a través de su LinkedIn profesional o enviándole un correo. ¡Está totalmente disponible para nuevas oportunidades laborales!';
    }
    return isEn
      ? `Thank you for your question! I understand your inquiry about "${pregunta}". Yanina has solid experience in Full Stack development with Spring Boot and Angular. Feel free to explore the Projects or Education section to learn more.`
      : `¡Gracias por tu pregunta! Comprendo tu consulta sobre "${pregunta}". Yanina cuenta con sólida experiencia en desarrollo Full Stack con Spring Boot y Angular. Puedes explorar la sección de Proyectos o Educación para conocer más.`;
  }
}
