export interface Proyecto {
  id?: number | string;
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
  institucion: string;
  titulo: string;
  periodo: string;
  descripcion: string;
  logoUrl?: string;
}

export interface GithubRepo {
  name: string;
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
}

export interface ChatRespuestaResponse {
  respuesta: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}
