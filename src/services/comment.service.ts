import { API_URL, getAuthHeaders } from './api';
import { CommentDto, CreateCommentDto } from '@/types'

export const CommentService = {
  
  /**
   * Obtiene todos los comentarios para una publicación específica.
   */
  getCommentsByPost: async (postId: number): Promise<CommentDto[]> => {
    // Asumiendo una ruta RESTful: /posts/{postId}/comments
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al obtener los comentarios');
    return response.json();
  },

  /**
   * Crea un nuevo comentario en una publicación.
   */
  createComment: async (postId: number, data: CreateCommentDto): Promise<CommentDto> => {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el comentario');
    }
    return response.json();
  },

  /**
   * Elimina un comentario por su ID.
   * Nota: Solo el autor o el administrador debería poder hacer esto.
   */
  deleteComment: async (commentId: number): Promise<void> => {
    // Asumiendo una ruta DELETE global para el comentario: /comments/{commentId}
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al eliminar el comentario');
  },
};