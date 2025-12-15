"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Loader2, MapPin, Globe, Image as ImageIcon } from "lucide-react";
import { formatISO } from "date-fns";

import { EventService } from "@/services/event.service";
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

interface CreateEventDialogProps {
  communityId?: number; // Opcional: Si se crea desde una comunidad específica
}

export function CreateEventDialog({ communityId }: CreateEventDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "", // Usaremos string para el input datetime-local
    endDate: "",
    location: "",
    isOnline: false,
    coverImageUrl: "",
    maxAttendees: "", // String para manejar el input number vacío
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.startDate || !formData.location) {
        toast({ title: "Faltan datos", description: "Completa los campos obligatorios.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);

    try {
      // Preparamos el DTO
      const payload: CreateEventDto = {
        title: formData.title,
        description: formData.description,
        // Convertimos la fecha del input a ISO para el backend
        startDateTime: new Date(formData.startDate).toISOString(),
        endDateTime: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        location: formData.location,
        isOnline: formData.isOnline,
        coverImageUrl: formData.coverImageUrl || null,
        maxAttendees: formData.maxAttendees ? Number(formData.maxAttendees) : null,
        communityId: communityId || null, // Se asocia si viene por props
      };

      const newEvent = await EventService.createEvent(payload);

      toast({
        title: "¡Evento creado!",
        description: `El evento "${newEvent.title}" está listo.`,
      });

      setOpen(false);
      
      // Limpiamos el formulario
      setFormData({
        title: "", description: "", startDate: "", endDate: "", 
        location: "", isOnline: false, coverImageUrl: "", maxAttendees: ""
      });

      // Redirigimos al detalle del evento creado
      router.push(`/event/${newEvent.id}`);
      router.refresh(); // Para actualizar listas si es necesario

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
          
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del evento *</Label>
            <Input
              id="title"
              placeholder="Ej: Taller de React Avanzado"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              placeholder="Detalles sobre qué se hará en el evento..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              maxLength={500}
              className="min-h-[100px]"
            />
          </div>

          {/* Fechas (Grid de 2 columnas) */}
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
                min={formData.startDate} // No puede terminar antes de empezar
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Switch Online/Presencial */}
          <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
            <Switch
              id="is-online"
              checked={formData.isOnline}
              onCheckedChange={(val) => setFormData({ ...formData, isOnline: val })}
            />
            <Label htmlFor="is-online" className="cursor-pointer flex-1">
              Es un evento virtual (Online)
            </Label>
            {formData.isOnline ? <Globe className="h-4 w-4 text-blue-500" /> : <MapPin className="h-4 w-4 text-orange-500" />}
          </div>

          {/* Ubicación / URL */}
          <div className="space-y-2">
            <Label htmlFor="location">
              {formData.isOnline ? "Enlace de la reunión / Plataforma *" : "Dirección física / Lugar *"}
            </Label>
            <Input
              id="location"
              placeholder={formData.isOnline ? "https://meet.google.com/..." : "Calle Falsa 123, Oficina 4"}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          {/* Capacidad y Portada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad Máxima (Opcional)</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                placeholder="Ilimitada"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Imagen de Portada (URL)</Label>
              <Input
                id="image"
                placeholder="https://..."
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
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