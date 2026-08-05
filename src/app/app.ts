import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { GithubMetricsComponent } from './components/github-metrics/github-metrics.component';
import { ChatAsistenteComponent } from './components/chat-asistente/chat-asistente.component';
import { FooterComponent } from './components/footer/footer.component';
import { EducacionComponent } from './components/educacion/educacion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    EducacionComponent,
    ProyectosComponent,
    GithubMetricsComponent,
    ChatAsistenteComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Portfolio - Yanina Dominé';
}
