import { API_URL, getAuthHeaders } from "./api";
import {
  UserLoginDto,
  AuthResponse,
  UserProfileDto,
  UserUpdateDto,
  UserRegisterDto,
  UserSummaryDto,
} from "@/types";

export const UserService = {
  // Login
  login: async (data: UserLoginDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al iniciar sesión");
    return response.json();
  },

  // Registro
  register: async (data: UserRegisterDto): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error en el registro");
  },

  // Obtener Perfil (del usuario actual o por ID)
  getProfile: async (userId?: number): Promise<UserProfileDto> => {
    // Si pasas ID busca ese usuario, si no, busca "me" (perfil propio)
    const endpoint = userId ? `/users/${userId}` : "/users/profile";

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al obtener perfil");
    return response.json();
  },

  // Actualizar Perfil
  updateProfile: async (data: UserUpdateDto): Promise<UserProfileDto> => {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error al actualizar perfil");
    return response.json();
  },
  //SEGUIR USUARIO
  followUser: async (userId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Error al seguir al usuario.");
    }
  },

  //DEJAR DE SEGUIR
  unfollowUser: async (userId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${userId}/follow`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Error al dejar de seguir.");
    }
  },

  // OBTENER SEGUIDORES
  getFollowers: async (userId: number): Promise<UserSummaryDto[]> => {
    const response = await fetch(`${API_URL}/users/${userId}/followers`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al cargar seguidores.");
    return response.json();
  },

  // OBTENER SEGUIDOS
  getFollowing: async (userId: number): Promise<UserSummaryDto[]> => {
    const response = await fetch(`${API_URL}/users/${userId}/following`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al cargar seguidos.");
    return response.json();
  },

  // Buscar usuarios
  searchUsers: async (query: string): Promise<UserProfileDto[]> => {
    if (!query) return [];
    const response = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) return [];
    return response.json();
  },
};
