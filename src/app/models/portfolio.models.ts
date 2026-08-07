export interface Proyecto {
  id?: number | string;
  key?: string;
  titulo: string;
  resumen: string;
  descripcion: string;
  tecnologias: string[];
  githubUrl: string;
  deployUrl?: string;
  imagenUrl?: string;
  destacado?: boolean;
}

export interface Educacion {
  id?: number | string;
  key?: string;
  institucion: string;
  titulo: string;
  periodo: string;
  descripcion: string;
  logoUrl?: string;
}

export interface GithubRepo {
  name: string;
  key?: string;
  description: string;
  htmlUrl: string;
  stars: number;
  language: string;
  updatedAt?: string;
}

export interface GithubMetrics {
  username: string;
  profileUrl: string;
  publicRepos: number;
  followers?: number;
  starsCount?: number;
  recentRepos: GithubRepo[];
}

export interface ChatPreguntaRequest {
  pregunta: string;
  language?: string;
}

export interface ChatRespuestaResponse {
  respuesta: string;
}

export interface CategoriaPreguntas {
  id: string;
  tituloKey: string;
  icono: string;
  preguntasKeys: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

