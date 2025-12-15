import { get } from 'http';
import { API_URL, getAuthHeaders } from './api';
import { PostDto, CreatePostDto, UpdatePostDto } from '@/types'

export const PostService = {

  /**
   * Obtiene una lista de publicaciones (ej: feed, perfil, o comunidad).
   */
  getPosts: async (query?: { communityId?: number, userId?: number }): Promise<PostDto[]> => {
    // Aquí puedes construir una URL con query params para filtrar posts
    const params = new URLSearchParams();
    if (query?.communityId) {
      params.append('communityId', query.communityId.toString());
    }
    if (query?.userId) {
      params.append('userId', query.userId.toString());
    }

    const response = await fetch(`${API_URL}/posts?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(), // Incluye Auth para obtener IsLikedByMe
    });

    if (!response.ok) throw new Error('Error al obtener publicaciones');
    return response.json();
  },

  /**
   * Obtiene los posts específicos de una comunidad.
   * Endpoint: GET /api/posts/community/{id}
   */
  getPostsByCommunity: async (communityId: number): Promise<PostDto[]> => {
    const response = await fetch(`${API_URL}/posts/community/${communityId}`, {
      method: 'GET',
      headers: getAuthHeaders(), // Importante: el back usa User.FindFirst para ver si le diste like
    });

    if (!response.ok) throw new Error('Error al obtener posts de la comunidad');
    return response.json();
  },

  /**
   * Crea una nueva publicación.
   */
  createPost: async (data: CreatePostDto): Promise<PostDto> => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la publicación');
    }
    return response.json();
  },

  /**
   * Actualiza una publicación existente.
   */
  updatePost: async (postId: number, data: UpdatePostDto): Promise<PostDto> => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT', // O 'PATCH' si tu backend lo permite
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al actualizar la publicación');
    return response.json();
  },

  /**
   * Elimina una publicación.
   */
  deletePost: async (postId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al eliminar la publicación');
  },

  // Función de interacción adicional
  likePost: async (postId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al dar "me gusta"');
  },

  // Función para seguir gente

  // Función para obtener el feed de home
  getFeedPosts: async (page: number = 1, pageSize: number = 10): Promise<PostDto[]> => {
    // Construimos los query params para la paginación
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await fetch(`${API_URL}/posts/feed?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al obtener el feed');
    return response.json();
  },
};