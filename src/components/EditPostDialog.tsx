"use client";

import { useState } from "react";
import { Loader2, Edit } from "lucide-react";
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

import { PostService } from "@/services/post.service";
import { ImageService } from "@/services/image.service";
import { PostDto } from "@/types";
import { ImageUpload } from "@/components/ImageUpload";

interface EditPostDialogProps {
  post: PostDto;
  onPostUpdated: () => void;
}

export function EditPostDialog({ post, onPostUpdated }: EditPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const [content, setContent] = useState(post.content);
  const [currentImageUrl, setCurrentImageUrl] = useState(post.imageUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = currentImageUrl;

      if (selectedFile) {
        try {
          const uploadResult = await ImageService.uploadImage(selectedFile, "posts");
          finalImageUrl = uploadResult.url;
        } catch (error) {
          throw new Error("No se pudo cargar la nueva imagen.");
        }
      }

      await PostService.updatePost(post.id, {
        content,
        imageUrl: finalImageUrl, //
      });

      toast({ title: "Post actualizado" });
      onPostUpdated();
      setOpen(false);
      setSelectedFile(null);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo editar el post.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          <span className="sr-only">Editar Post</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Publicación</DialogTitle>
          <DialogDescription>
            Corrige o modifica tu publicación.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          {/* Contenido del Post */}
          <div className="grid gap-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Imagen de la publicación */}
          <div className="space-y-2">
            <Label>Imagen de la publicación</Label>
            <ImageUpload
              value={currentImageUrl}
              onChange={(file) => {
                setSelectedFile(file);
                if (file === null) setCurrentImageUrl(null);
              }}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
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