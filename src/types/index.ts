// Database Models

// --- DTOs (Data Transfer Objects) ---

export interface UserProfileDto {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  followersCount: number;
  followingCount: number;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UserUpdateDto {
  bio: string | null;
  avatarUrl: string | null;
}

// --- DTO para la Respuesta del Backend (El Post Completo) ---
export interface PostDto {
  // Propiedades principales
  id: number;
  content: string;
  imageUrl: string | null;      // C# string?
  createdAt: string;            // C# DateTime

  // Datos del Autor
  authorId: number;
  authorName: string;
  authorAvatar: string | null;  // C# string?

  // Contexto (Propiedades opcionales y/o nulas)
  communityId: number | null;   // C# int?
  communityName: string | null; // C# string?
  eventId: number | null;       // C# int?
  eventTitle: string | null;    // C# string?

  // Contadores
  likesCount: number;
  commentsCount: number;

  // Estado del usuario actual
  isLikedByMe: boolean;
}

// --- DTO para Crear una nueva Publicación ---
export interface CreatePostDto {
  content: string;              // Required
  imageUrl?: string | null;     // C# string?. Aquí lo hacemos opcional en el envío
  communityId?: number | null;  // C# int?. Aquí lo hacemos opcional
  eventId?: number | null;      // C# int?. Aquí lo hacemos opcional
}

// --- DTO para Actualizar una Publicación ---
export interface UpdatePostDto {
  content: string;              // Required
  imageUrl?: string | null;     // C# string?. Aquí lo hacemos opcional en el envío
}
// --- DTO para la Respuesta del Backend (El Evento Completo) ---
export interface EventDto {
  // Propiedades principales
  id: number;
  title: string;
  description: string;
  startDateTime: string;          // C# DateTime
  endDateTime: string | null;     // C# DateTime?
  location: string;
  isOnline: boolean;
  coverImageUrl: string | null;   // C# string?
  maxAttendees: number | null;    // C# int?

  // Organizador
  organizerId: number;
  organizerName: string;
  organizerAvatar: string | null; // C# string?

  // Comunidad (Puede ser nulo)
  communityId: number | null;     // C# int?
  communityName: string | null;   // C# string?

  // Estadísticas
  attendeesCount: number;

  // Estado del usuario actual
  myRsvpStatus: string | null;    // C# string? (Ej: "Going", "Maybe", "NotGoing")
}

// --- DTO para Crear un nuevo Evento ---
export interface CreateEventDto {
  title: string;
  description: string;
  startDateTime: string;          // Usar string ISO 8601 al enviar
  endDateTime?: string | null;    // Opcional en el envío, usar string ISO 8601 o null
  location: string;
  isOnline?: boolean;             // Opcional en el envío (tiene default = false)
  coverImageUrl?: string | null;  // Opcional
  maxAttendees?: number | null;   // Opcional
  communityId?: number | null;    // Opcional
}

// --- DTO para Actualizar un Evento existente ---
export interface UpdateEventDto {
  title: string;
  description: string;
  startDateTime: string;          // Usar string ISO 8601 al enviar
  endDateTime?: string | null;    // Opcional en el envío
  location: string;
  isOnline?: boolean;             // Opcional en el envío
  coverImageUrl?: string | null;  // Opcional
  maxAttendees?: number | null;   // Opcional
}

// --- DTO para la Respuesta del Backend (La Comunidad Completa) ---
export interface CommunityDto {
  // Propiedades principales
  id: number;
  name: string;
  description: string;
  coverImageUrl: string | null; // C# string?

  // Datos calculados o de relaciones
  memberCount: number;

  // Información del Dueño
  ownerId: number;
  ownerName: string; 

  createdAt: string;            // C# DateTime

  // Estado del usuario actual
  isMember: boolean;            // ¿El usuario actual es miembro?
}

// --- DTO para Crear una nueva Comunidad ---
export interface CreateCommunityDto {
  name: string;
  description: string;
  coverImageUrl?: string | null; // Opcional en el envío
}

// --- DTO para Actualizar una Comunidad existente ---
export interface UpdateCommunityDto {
  name: string;
  description: string;
  coverImageUrl?: string | null; // Opcional en el envío
}

// --- DTO para la Respuesta del Backend (El Comentario Completo) ---
export interface CommentDto {
  id: number;
  content: string;
  createdAt: string;            // C# DateTime

  // Datos del Autor
  authorId: number;
  authorName: string;
  authorAvatar: string | null;  // C# string?
}

// --- DTO para Crear un nuevo Comentario ---
export interface CreateCommentDto {
  content: string;              // Required
}

// Basado en AuthResponseDto.cs
// Este es CRUCIAL para tu login
export interface AuthResponse {
  token: string;
  userId: number;   // Coincide con public int UserId
  username: string; // Coincide con public string Username
  email: string;    // Coincide con public string Email
}