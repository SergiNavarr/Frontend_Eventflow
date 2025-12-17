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
import { EventDto, UpdateEventDto } from "@/types";

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
  const { toast } = useToast();

  const formatForInput = (isoString?: string | null) => {
    if (!isoString) return "";
    // Creamos objeto Date y lo pasamos a ISO, luego cortamos segundos y zona horaria
    return new Date(isoString).toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    startDateTime: formatForInput(event.startDateTime),
    endDateTime: formatForInput(event.endDateTime),
    location: event.location,
    isOnline: event.isOnline, // Boolean
    maxAttendees: event.maxAttendees || 0, // Usamos 0 para representar "sin límite" visualmente
    coverImageUrl: event.coverImageUrl || "",
  });

  // Manejador genérico para Inputs de texto/número
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador específico para Checkbox (isOnline)
  const handleCheckChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isOnline: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: UpdateEventDto = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        isOnline: formData.isOnline,
        coverImageUrl: formData.coverImageUrl || null,

        // Convertir fechas de vuelta a ISO completo
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: formData.endDateTime
          ? new Date(formData.endDateTime).toISOString()
          : null,

        // Convertir string a number, enviar null si es 0
        maxAttendees:
          Number(formData.maxAttendees) > 0
            ? Number(formData.maxAttendees)
            : null,
      };

      await EventService.updateEvent(event.id, payload);

      toast({ title: "Evento actualizado correctamente" });
      onEventUpdated();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios.",
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
          {/* Título */}
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

          {/* Fechas */}
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

          {/* Ubicación y Online */}
          <div className="grid gap-4 border p-4 rounded-md">
            <div className="flex items-center space-x-2">
              {/* Checkbox */}
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
                {formData.isOnline ? (
                  <Globe className="h-4 w-4" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {formData.isOnline
                  ? "Enlace de la reunión / Plataforma"
                  : "Dirección física"}
              </Label>
              <Input
                id="location"
                name="location"
                placeholder={
                  formData.isOnline ? "https://zoom.us/..." : "Calle Falsa 123"
                }
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Capacidad y Descripción */}
          <div className="grid gap-2">
            <Label htmlFor="maxAttendees">
              Capacidad Máxima (0 = Ilimitada)
            </Label>
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
