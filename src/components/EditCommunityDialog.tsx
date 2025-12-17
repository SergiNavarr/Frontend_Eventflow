"use client";

import { useState } from "react";
import { Loader2, Edit, ImageIcon } from "lucide-react";
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

import { CommunityService } from "@/services/community.service";
import { CommunityDto, UpdateCommunityDto } from "@/types";

interface EditCommunityDialogProps {
  community: CommunityDto;
  onCommunityUpdated: () => void;
}

export function EditCommunityDialog({
  community,
  onCommunityUpdated,
}: EditCommunityDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Estado inicial del formulario basado en la comunidad actual
  const [formData, setFormData] = useState<UpdateCommunityDto>({
    name: community.name,
    description: community.description,
    coverImageUrl: community.coverImageUrl || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usamos el servicio que definiste
      await CommunityService.updateCommunity(community.id, {
        name: formData.name,
        description: formData.description,
        coverImageUrl: formData.coverImageUrl || null, 
      });

      toast({ title: "Comunidad actualizada correctamente" });

      onCommunityUpdated();

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
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Editar Comunidad
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Comunidad</DialogTitle>
          <DialogDescription>
            Actualiza la información visible de tu comunidad.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Nombre */}
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre de la comunidad</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción */}
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

          {/* Imagen de Portada (URL) */}
          <div className="grid gap-2">
            <Label htmlFor="coverImageUrl" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> URL de Portada
            </Label>
            <Input
              id="coverImageUrl"
              name="coverImageUrl"
              value={formData.coverImageUrl || ""}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.coverImageUrl && (
              <p className="text-xs text-muted-foreground truncate">
                Vista previa disponible al guardar.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
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
