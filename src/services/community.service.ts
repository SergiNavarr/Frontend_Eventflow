import { API_URL, getAuthHeaders } from './api';
import { CommunityDto, CreateCommunityDto, UpdateCommunityDto } from '@/types'

export const CommunityService = {

  /**
   * Obtiene una comunidad por su ID.
   */
  getCommunity: async (communityId: number): Promise<CommunityDto> => {
    const response = await fetch(`${API_URL}/communities/${communityId}`, {
      method: 'GET',
      headers: getAuthHeaders(), // Para saber si el usuario es miembro (IsMember)
    });

    if (!response.ok) throw new Error('Error al obtener la comunidad');
    return response.json();
  },

  /**
   * Crea una nueva comunidad.
   */
  createCommunity: async (data: CreateCommunityDto): Promise<CommunityDto> => {
    const response = await fetch(`${API_URL}/communities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la comunidad');
    }
    return response.json();
  },

  /**
   * Actualiza una comunidad existente.
   */
  updateCommunity: async (communityId: number, data: UpdateCommunityDto): Promise<CommunityDto> => {
    const response = await fetch(`${API_URL}/communities/${communityId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al actualizar la comunidad');
    return response.json();
  },

  /**
   * Une al usuario actual a la comunidad.
   */
  joinCommunity: async (communityId: number): Promise<void> => {
    // Asumiendo un endpoint como POST /communities/{id}/join
    const response = await fetch(`${API_URL}/communities/${communityId}/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al unirse a la comunidad');
  },

  /**
   * Saca al usuario actual de la comunidad.
   */
  leaveCommunity: async (communityId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/communities/${communityId}/leave`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); 
        const message = errorData.message || 'Error al salir de la comunidad';
        throw new Error(message);
    }
  },

  getAllCommunities: async (): Promise<CommunityDto[]> => {
    const response = await fetch(`${API_URL}/communities`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al obtener comunidades');
    return response.json();
  },
  
  getCommunitiesByUser: async (targetUserId: number): Promise<CommunityDto[]> => {
    const response = await fetch(`${API_URL}/communities/user/${targetUserId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al obtener las comunidades del usuario');
    }

    return response.json();
  },

  // Buscar comunidades por nombre
  searchCommunities: async (query: string): Promise<CommunityDto[]> => {
    if (!query) return [];
    const response = await fetch(`${API_URL}/communities/search?query=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) return [];
    return response.json();
},
};