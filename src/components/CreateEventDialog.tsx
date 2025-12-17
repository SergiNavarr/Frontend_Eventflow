"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Loader2, MapPin, Globe, Image as ImageIcon } from "lucide-react";

import { EventService } from "@/services/event.service";
import { PostService } from "@/services/api";
import { ImageService } from "@/services/api";
import { CreateEventDto } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { ImageUpload } from "./ImageUpload";

interface CreateEventDialogProps {
  communityId?: number; 
}

export function CreateEventDialog({ communityId }: CreateEventDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    maxAttendees: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.startDate || !formData.location) {
      toast({ title: "Faltan datos", description: "Completa los campos obligatorios.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = null;

      if (selectedFile) {
        try {
          const uploadResult = await ImageService.uploadImage(selectedFile, "events");
          finalImageUrl = uploadResult.url;
        } catch (error) {
          throw new Error("No se pudo subir la imagen de portada.");
        }
      }

      const payload: CreateEventDto = {
        title: formData.title,
        description: formData.description,
        startDateTime: new Date(formData.startDate).toISOString(),
        endDateTime: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        location: formData.location,
        isOnline: formData.isOnline,
        coverImageUrl: finalImageUrl, // URL real de Cloudinary
        maxAttendees: formData.maxAttendees ? Number(formData.maxAttendees) : null,
        communityId: communityId || null,
      };

      const newEvent = await EventService.createEvent(payload);

      try {
        await PostService.createPost({
          content: `¡He organizado un nuevo evento: "${newEvent.title}"! 📅\n\n${newEvent.description.substring(0, 120)}...\n\n¡Están todos invitados!`,
          eventId: newEvent.id,
          communityId: communityId || null,
          imageUrl: newEvent.coverImageUrl
        });
      } catch (postError) {
        console.error("Error al crear post automático:", postError);
      }

      toast({
        title: "¡Evento creado!",
        description: `El evento "${newEvent.title}" está listo y publicado.`,
      });

      setOpen(false);
      setFormData({
        title: "", description: "", startDate: "", endDate: "",
        location: "", isOnline: false, maxAttendees: ""
      });
      setSelectedFile(null);

      router.push(`/event/${newEvent.id}`);
      router.refresh();

    } catch (error: any) {
      toast({
        title: "Error al crear",
        description: error.message || "Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-md">
          <CalendarPlus className="h-4 w-4" />
          Crear Evento
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Organizar nuevo evento</DialogTitle>
          <DialogDescription>
            {communityId
              ? "Este evento será visible para los miembros de la comunidad."
              : "Crea un evento público para todos los usuarios."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Título y Descripción (Igual que antes) */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          {/* Fechas y Ubicación*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Inicio *</Label>
              <Input
                id="start"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">Fin (Opcional)</Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Switch Online y Ubicación */}
          <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
            <Switch
              id="is-online"
              checked={formData.isOnline}
              onCheckedChange={(val) => setFormData({ ...formData, isOnline: val })}
            />
            <Label htmlFor="is-online" className="cursor-pointer flex-1">Evento Online</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación / Enlace *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          {/* Imagen de Portada*/}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Imagen de Portada</Label>
              <ImageUpload
                onChange={(file) => setSelectedFile(file)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad Máxima</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...
                </>
              ) : (
                "Publicar Evento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}