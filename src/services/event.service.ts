import { API_URL, getAuthHeaders } from './api';
import { EventDto, CreateEventDto, UpdateEventDto } from '@/types'

export const EventService = {

  /**
   * Obtiene un evento por su ID.
   */
  getEvent: async (eventId: number): Promise<EventDto> => {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'GET',
      headers: getAuthHeaders(), // Para obtener MyRsvpStatus
    });

    if (!response.ok) throw new Error('Error al obtener el evento');
    return response.json();
  },

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

  /**
   * Establece el estado de RSVP del usuario.
   * @param status El estado de asistencia (ej: "Going", "Maybe", "NotGoing")
   */
  setRsvpStatus: async (eventId: number, status: string): Promise<void> => {
    // Asumiendo un endpoint como POST /events/{eventId}/rsvp
    const response = await fetch(`${API_URL}/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error('Error al actualizar la asistencia');
  },
};