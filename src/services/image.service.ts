// src/services/image.service.ts
import { API_URL, getAuthHeaders } from './api';
import { ImageUploadDto, ImageUploadResponseDto } from '@/types';

export const ImageService = {
  /**
   * Sube una imagen a Cloudinary a través del backend.
   */
  uploadImage: async (file: File, folder: string = "general"): Promise<ImageUploadResponseDto> => {
    // Convertir archivo a Base64
    const base64WithHeader = await toBase64(file);
    
    // Limpiar el prefijo (data:image/png;base64,...)
    const rawBase64 = base64WithHeader.split(',')[1];

    const payload: ImageUploadDto = {
      imageBase64: rawBase64,
      folder: folder
    };

    const response = await fetch(`${API_URL}/images/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    return response.json();
  }
};

/**
 * Helper para convertir File a cadena Base64
 */
const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};