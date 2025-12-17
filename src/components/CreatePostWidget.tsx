"use client";

import { useState } from 'react';
import { Send, Image as ImageIcon, Loader2 } from 'lucide-react';
import { PostService } from '@/services/api';
import { ImageService } from '@/services/api';
import { CreatePostDto } from '@/types'; //

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ImageUpload";

interface CreatePostWidgetProps {
  onPostCreated?: () => void; 
  communityId?: number;       
  eventId?: number;           
  userAvatarUrl?: string;     
}

export const CreatePostWidget = ({ 
  onPostCreated, 
  communityId, 
  eventId,
  userAvatarUrl 
}: CreatePostWidgetProps) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      let uploadedImageUrl = null;

      if (selectedFile) {
        try {
          const result = await ImageService.uploadImage(selectedFile, "posts");
          uploadedImageUrl = result.url;
        } catch (error) {
          throw new Error("No se pudo subir la imagen. Inténtalo de nuevo.");
        }
      }

      const postData: CreatePostDto = {
        content: content,
        imageUrl: uploadedImageUrl, 
        communityId: communityId || undefined,
        eventId: eventId || undefined
      };

      await PostService.createPost(postData);

      setContent('');
      setSelectedFile(null);
      setShowImageUpload(false);
      
      toast({
        title: "¡Publicado!",
        description: "Tu publicación se ha creado correctamente.",
      });

      if (onPostCreated) {
        onPostCreated();
      }

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la publicación.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleImage = () => {
    setShowImageUpload(!showImageUpload);
  };

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10 border border-border/50">
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
            
            {(showImageUpload || selectedFile) && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <ImageUpload
                  onChange={(file) => {
                    setSelectedFile(file);
                    if (!file) setShowImageUpload(false);
                  }}
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <div className="flex gap-2">
                <Button 
                  variant={showImageUpload || selectedFile ? "secondary" : "ghost"} 
                  size="sm" 
                  className={`gap-2 ${!(showImageUpload || selectedFile) && "text-muted-foreground hover:text-primary"}`}
                  onClick={handleToggleImage}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-xs font-medium">Foto</span>
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