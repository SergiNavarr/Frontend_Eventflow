import { API_URL, getAuthHeaders } from './api';
import { UserLoginDto, AuthResponse, UserProfileDto, UserUpdateDto, UserRegisterDto } from '@/types'

export const UserService = {
  
  // Login
  login: async (data: UserLoginDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al iniciar sesión');
    return response.json();
  },

  // Registro
  register: async (data: UserRegisterDto): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error en el registro');
  },

  // Obtener Perfil (del usuario actual o por ID)
  getProfile: async (userId?: number): Promise<UserProfileDto> => {
    // Si pasas ID busca ese usuario, si no, busca "me" (perfil propio)
    const endpoint = userId ? `/users/${userId}` : '/users/profile'; 
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Error al obtener perfil');
    return response.json();
  },

  // Actualizar Perfil
  updateProfile: async (data: UserUpdateDto): Promise<UserProfileDto> => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al actualizar perfil');
    return response.json();
  }
};