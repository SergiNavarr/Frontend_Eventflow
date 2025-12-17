"use client";

import { useState } from "react";
import { Loader2, UserCog } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { UserService, ImageService } from "@/services/api";
import { UserProfileDto } from "@/types";
import { ImageUpload } from "@/components/ImageUpload";

interface EditProfileDialogProps {
  user: UserProfileDto;
  onUpdate: () => void;
  children?: React.ReactNode;
}

export function EditProfileDialog({ user, onUpdate, children }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    bio: user.bio || "",
    avatarUrl: user.avatarUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalAvatarUrl = formData.avatarUrl;

      if (selectedFile) {
        try {
          const uploadResult = await ImageService.uploadImage(selectedFile, "users");
          finalAvatarUrl = uploadResult.url;
        } catch (error) {
          throw new Error("No se pudo subir la foto de perfil.");
        }
      }

      await UserService.updateProfile({
        bio: formData.bio,
        avatarUrl: finalAvatarUrl
      });

      toast({ title: "Perfil actualizado con éxito" });
      onUpdate(); 
      setOpen(false); 
      setSelectedFile(null);
    } catch (error: any) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: error.message || "No se pudieron guardar los cambios." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
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
          
          {/* Componente de Subida de Imagen*/}
          <div className="space-y-2">
            <Label>Foto de Perfil</Label>
            <ImageUpload
              value={formData.avatarUrl} 
              onChange={(file) => setSelectedFile(file)}
            />
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