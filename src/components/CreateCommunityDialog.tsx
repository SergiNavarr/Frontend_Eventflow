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

export function CreateCommunityDialog() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado del formulario
  const [formData, setFormData] = useState<CreateCommunityDto>({
    name: "",
    description: "",
    coverImageUrl: "", // Opcional
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
      // 1. Llamar al servicio
      // Enviamos null o undefined si el string de imagen está vacío para que el back no guarde ""
      const payload = {
        ...formData,
        coverImageUrl: formData.coverImageUrl || null
      };

      const newCommunity = await CommunityService.createCommunity(payload);

      // 2. Éxito
      toast({
        title: "¡Comunidad creada!",
        description: `Has creado "${newCommunity.name}" exitosamente.`,
      });

      setOpen(false); 
      setFormData({ name: "", description: "", coverImageUrl: "" });

      router.push(`/communities/${newCommunity.id}`);

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

          {/* URL de Imagen (Opcional) */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Imagen de Portada (URL)
            </Label>
            <Input
              id="image"
              placeholder="https://..."
              value={formData.coverImageUrl || ""}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
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