"use client";

import { useState } from "react";
import { Loader2, UploadCloud, UserCog } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { UserService } from "@/services/user.service";
import { UserProfileDto } from "@/types";

interface EditProfileDialogProps {
  user: UserProfileDto;
  onUpdate: () => void; // Función para recargar la página padre
  children?: React.ReactNode; // El botón que abrirá el modal
}

export function EditProfileDialog({ user, onUpdate, children }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
  });

  // --- SUBIDA A CLOUDINARY ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      // REEMPLAZA CON TUS DATOS REALES DE CLOUDINARY
      data.append("upload_preset", "tu_preset_unsigned"); 
      
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload",
        { method: "POST", body: data }
      );
      
      const fileData = await res.json();
      if (fileData.secure_url) {
        setFormData(prev => ({ ...prev, avatarUrl: fileData.secure_url }));
        toast({ description: "Imagen cargada correctamente" });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error al subir imagen" });
    } finally {
      setUploadingImage(false);
    }
  };

  // --- GUARDAR CAMBIOS EN BACKEND ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await UserService.updateProfile({
        bio: formData.bio,
        avatarUrl: formData.avatarUrl
      });

      toast({ title: "Perfil actualizado con éxito" });
      onUpdate(); // Recargamos los datos del padre
      setOpen(false); // Cerramos modal
    } catch (error) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "No se pudieron guardar los cambios." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
            // Botón por defecto si no le pasas children
            <Button variant="outline" size="sm">
               <UserCog className="mr-2 h-4 w-4" /> Editar Perfil
            </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>Actualiza tu foto y biografía.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          
          {/* Avatar + Subida */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-2 border-primary/20">
               {uploadingImage ? (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                     <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
               ) : (
                 <>
                   <AvatarImage src={formData.avatarUrl} className="object-cover" />
                   <AvatarFallback>{user.username.slice(0,2).toUpperCase()}</AvatarFallback>
                 </>
               )}
            </Avatar>
            
            <div className="w-full max-w-xs">
               <Label htmlFor="picture" className="sr-only">Imagen</Label>
               <Input 
                 id="picture" 
                 type="file" 
                 accept="image/*"
                 onChange={handleImageUpload}
                 disabled={uploadingImage || loading}
               />
            </div>
          </div>

          {/* Bio */}
          <div className="grid gap-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              placeholder="Cuéntanos sobre ti..."
              className="resize-none h-24"
              maxLength={300}
            />
             <div className="text-xs text-right text-muted-foreground">
               {formData.bio.length}/300
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading || uploadingImage}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}