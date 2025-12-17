"use client";

import { useState } from "react";
import { Loader2, Edit, CalendarIcon, MapPin, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { EventService } from "@/services/event.service";
import { ImageService } from "@/services/image.service";
import { EventDto, UpdateEventDto } from "@/types";
import { ImageUpload } from "./ImageUpload";

interface EditEventDialogProps {
  event: EventDto;
  onEventUpdated: () => void;
}

export function EditEventDialog({
  event,
  onEventUpdated,
}: EditEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const formatForInput = (isoString?: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    startDateTime: formatForInput(event.startDateTime),
    endDateTime: formatForInput(event.endDateTime),
    location: event.location,
    isOnline: event.isOnline,
    maxAttendees: event.maxAttendees || 0,
    coverImageUrl: event.coverImageUrl || null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isOnline: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.coverImageUrl;

      if (selectedFile) {
        try {
          const uploadResult = await ImageService.uploadImage(selectedFile, "events");
          finalImageUrl = uploadResult.url;
        } catch (error) {
          throw new Error("No se pudo cargar la nueva imagen de portada.");
        }
      }

      const payload: UpdateEventDto = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        isOnline: formData.isOnline,
        coverImageUrl: finalImageUrl, 

        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: formData.endDateTime
          ? new Date(formData.endDateTime).toISOString()
          : null,

        maxAttendees:
          Number(formData.maxAttendees) > 0
            ? Number(formData.maxAttendees)
            : null,
      };

      await EventService.updateEvent(event.id, payload);

      toast({ title: "Evento actualizado correctamente" });
      onEventUpdated();
      setOpen(false);
      setSelectedFile(null);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudieron guardar los cambios.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento</DialogTitle>
          <DialogDescription>
            Modifica los detalles principales del evento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Subida de Imagen Diferida */}
          <div className="space-y-2">
            <Label>Imagen de Portada</Label>
            <ImageUpload
              value={formData.coverImageUrl} // Muestra la imagen actual del evento
              onChange={(file) => {
                setSelectedFile(file);
                // Si el usuario borra la imagen, marcamos la URL actual como null
                if (file === null) setFormData(prev => ({ ...prev, coverImageUrl: null }));
              }}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDateTime">Inicio</Label>
              <Input
                id="startDateTime"
                name="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDateTime">Fin (Opcional)</Label>
              <Input
                id="endDateTime"
                name="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid gap-4 border p-4 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOnline"
                checked={formData.isOnline}
                onCheckedChange={handleCheckChange}
              />
              <Label htmlFor="isOnline" className="cursor-pointer">
                ¿Es un evento virtual?
              </Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                {formData.isOnline ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                {formData.isOnline ? "Enlace / Plataforma" : "Dirección física"}
              </Label>
              <Input
                id="location"
                name="location"
                placeholder={formData.isOnline ? "https://zoom.us/..." : "Calle Falsa 123"}
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maxAttendees">Capacidad Máxima (0 = Ilimitada)</Label>
            <Input
              id="maxAttendees"
              name="maxAttendees"
              type="number"
              min="0"
              value={formData.maxAttendees}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px]"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}