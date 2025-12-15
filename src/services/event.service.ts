import { API_URL, getAuthHeaders } from './api';
import { EventDto, CreateEventDto, UpdateEventDto } from '@/types'

export const EventService = {
  /**
   * Crea un nuevo evento.
   */
  createEvent: async (data: CreateEventDto): Promise<EventDto> => {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el evento');
    }
    return response.json();
  },

  /**
   * Actualiza un evento existente.
   */
  updateEvent: async (eventId: number, data: UpdateEventDto): Promise<EventDto> => {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al actualizar el evento');
    return response.json();
  },

  getById: async (id: number): Promise<EventDto> => {
    const response = await fetch(`${API_URL}/events/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar el evento");
    return response.json();
  },

  // POST: api/events/{id}/join
  joinEvent: async (eventId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}/join`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "No se pudo unir al evento");
    }
  },

  // POST: api/events/{id}/leave
  leaveEvent: async (eventId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/events/${eventId}/leave`, {
      method: "POST", // Coincide con [HttpPost("{id}/leave")] en tu controller
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("No se pudo salir del evento");
  },

  // Endpoint de asistentes (Opcional, si lo implementas a futuro)
  getAttendees: async (eventId: number) => {
      // EventsController actual NO tiene endpoint de asistentes,
      // así que devolvemos vacío para que no rompa la UI.
      return []; 
  },

  // Endpoint para obtener eventos del calendario del usuario
  getMyCalendarEvents: async (): Promise<EventDto[]> => {
    const response = await fetch(`${API_URL}/events/calendar`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error al cargar el calendario");
    return response.json();
  },
};