"use client";

import { useState } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { PostService } from '@/services/post.service';
import { CreatePostDto } from '@/types';

// Componentes UI (Asumiendo que los tienes en tu carpeta de UI)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CreatePostWidgetProps {
  onPostCreated?: () => void; // Callback para recargar el feed
  communityId?: number;       // Opcional: Si estamos en una comunidad
  eventId?: number;           // Opcional: Si estamos en un evento
  userAvatarUrl?: string;     // Opcional: Para mostrar en el avatar del input
}

export const CreatePostWidget = ({ 
  onPostCreated, 
  communityId, 
  eventId,
  userAvatarUrl 
}: CreatePostWidgetProps) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Por ahora manejaremos URL directa o null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      // 1. Construir el DTO
      const postData: CreatePostDto = {
        content: content,
        imageUrl: imageUrl || undefined, // Si es null, enviamos undefined
        communityId: communityId || undefined,
        eventId: eventId || undefined
      };

      // 2. Llamar al servicio
      await PostService.createPost(postData);

      // 3. Éxito: Limpiar y notificar
      setContent('');
      setImageUrl(null);
      
      toast({
        title: "¡Publicado!",
        description: "Tu publicación se ha creado correctamente.",
      });

      // 4. Avisar al componente padre (Home) para que actualice la lista
      if (onPostCreated) {
        onPostCreated();
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo crear la publicación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejo simulado de imagen (ya que el backend espera un string URL)
  const handleImageClick = () => {
    const url = prompt("Ingresa la URL de la imagen (Demo):");
    if (url) setImageUrl(url);
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 border border-border/50">
            {/* Si no hay avatar, mostramos fallback */}
            <AvatarImage src={userAvatarUrl} />
            <AvatarFallback>YO</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <Textarea
              placeholder={
                eventId 
                  ? "Comparte algo sobre este evento..." 
                  : communityId 
                    ? "Escribe algo para la comunidad..." 
                    : "¿Qué estás pensando hoy?"
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px] resize-none border-none bg-transparent p-0 placeholder:text-muted-foreground focus-visible:ring-0"
            />
            
            {/* Previsualización de imagen adjunta */}
            {imageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-border/50 bg-muted max-h-40 w-fit">
                <img src={imageUrl} alt="Preview" className="h-40 w-auto object-cover" />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => setImageUrl(null)}
                >
                  ×
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-primary"
                  onClick={handleImageClick}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  <span className="text-xs">Foto</span>
                </Button>
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={!content.trim() || isSubmitting}
                size="sm"
                className="px-6"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Publicar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};