// services/api.ts

// 1. Configuración Base
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5206/api';

// 2. Helper para Headers (Usado por todos los servicios)
export const getAuthHeaders = (isFormData: boolean = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    // Si no es FormData, enviamos JSON
    ...(!isFormData && { 'Content-Type': 'application/json' }), 
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return headers;
};

// 3. Re-exportar todos los servicios
import { UserService } from './user.service';
import { PostService } from './post.service';
import { EventService } from './event.service';
import { CommunityService } from './community.service';
import { CommentService } from './comment.service';

export {
  UserService,
  PostService,
  EventService,
  CommunityService,
  CommentService,
};