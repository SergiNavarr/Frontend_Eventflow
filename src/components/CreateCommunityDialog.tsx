"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Loader2, Image as ImageIcon } from "lucide-react";

import { CommunityService } from "@/services/community.service";
import { CreateCommunityDto } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ImageUpload";
import { PostService, ImageService } from "@/services/api";

export function CreateCommunityDialog() {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState<CreateCommunityDto>({
    name: "",
    description: "",
    coverImageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.name.trim() || !formData.description.trim()) return;
    if (formData.name.length > 50) {
      toast({ title: "Nombre muy largo", description: "Máximo 50 caracteres.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = null;

      // 1. SUBIDA DIFERIDA DE IMAGEN
      // Si el usuario seleccionó un archivo local en el componente ImageUpload, lo subimos ahora.
      // Asumimos que 'selectedFile' es el estado que guarda el objeto File.
      if (selectedFile) {
        try {
          const uploadResult = await ImageService.uploadImage(selectedFile, "communities");
          finalImageUrl = uploadResult.url;
        } catch (uploadError: any) {
          // Si falla la imagen, lanzamos error para no crear la comunidad sin imagen si el usuario la puso
          throw new Error("Error al cargar la imagen de portada. Inténtalo de nuevo.");
        }
      }

      // 2. CREACIÓN DE LA COMUNIDAD
      const payload = {
        ...formData,
        coverImageUrl: finalImageUrl || null
      };

      const newCommunity = await CommunityService.createCommunity(payload);

      // 3. CREACIÓN AUTOMÁTICA DE POST (Chained Request)
      // Creamos un post en el feed anunciando la nueva comunidad sin tocar el backend.
      try {
        await PostService.createPost({
          content: `¡Acabo de fundar la comunidad "${newCommunity.name}"! 🚀\n\n${newCommunity.description.substring(0, 150)}...\n\n¡Únanse para participar!`,
          communityId: newCommunity.id,
          imageUrl: newCommunity.coverImageUrl // Reutilizamos la misma imagen
        });
      } catch (postError) {
        // Error silencioso: si el post automático falla, no queremos interrumpir la experiencia
        // del usuario ya que la comunidad SÍ se creó correctamente.
        console.error("La comunidad se creó pero el post automático falló:", postError);
      }

      // 4. ÉXITO Y LIMPIEZA
      toast({
        title: "¡Comunidad creada!",
        description: `Has creado "${newCommunity.name}" exitosamente.`,
      });

      setOpen(false);
      // Reseteamos estados
      setFormData({ name: "", description: "", coverImageUrl: "" });
      if (typeof setSelectedFile === 'function') setSelectedFile(null);

      // Redirigir y refrescar para mostrar el nuevo post en el feed
      router.push(`/communities/${newCommunity.id}`);
      router.refresh();

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la comunidad. Verifica que el nombre no exista.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          Crear Comunidad
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] border-border/80 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-5 w-5 text-primary" />
            Crear nueva comunidad
          </DialogTitle>
          <DialogDescription>
            Crea un espacio para compartir intereses. Tú serás el administrador.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Ej: Desarrolladores .NET"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              maxLength={50}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="¿De qué trata esta comunidad?"
              className="resize-none min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.description.length}/500
            </p>
          </div>


          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Imagen de Portada (URL)
            </Label>
            <ImageUpload
              onChange={(file) => setSelectedFile(file)}
              disabled={isSubmitting}
            />
          </div>

          {/* Preview pequeña si hay imagen */}
          {formData.coverImageUrl && (
            <div className="rounded-md overflow-hidden h-24 w-full bg-muted border border-border">
              <img src={formData.coverImageUrl} alt="Preview" className="h-full w-full object-cover opacity-80" />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name || !formData.description}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
                </>
              ) : (
                "Crear Comunidad"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}