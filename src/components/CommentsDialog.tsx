"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { CommentService } from "@/services/comment.service";
import { CommentDto, CreateCommentDto } from "@/types";
import { CommentItem } from "./CommentItem";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

interface CommentsDialogProps {
  postId: number;
  initialCommentsCount?: number;
  onCommentAdded?: () => void;
  children?: React.ReactNode;
}

export const CommentsDialog = ({
  postId,
  initialCommentsCount = 0,
  onCommentAdded,
  children,
}: CommentsDialogProps) => {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // estados
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // cargar comentarios cuando se abre
  useEffect(() => {
    if (open) {
      loadComments();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current && comments.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const comentariosDelPost = await CommentService.getCommentsByPost(postId);
      setComments(comentariosDelPost);
    } catch (errorAlCargar) {
      console.error("Error al cargar comentarios:", errorAlCargar);
      toast({
        title: "Error",
        description: "No se pudieron cargar los comentarios",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmit = async (evento?: React.FormEvent) => {
    evento?.preventDefault();
    
    if (!newCommentText.trim()) return;

    setIsSubmitting(true);

    try {
      const datosDelComentario: CreateCommentDto = {
        content: newCommentText.trim(),
      };

      const comentarioCreado = await CommentService.createComment(postId, datosDelComentario);
      
      // se agrega el nuevo comentario al final de la lista
      setComments((comentariosAnteriores) => [...comentariosAnteriores, comentarioCreado]);
      setNewCommentText("");
      
      // se actualiza el contador
      onCommentAdded?.();

      toast({
        title: "Comentario publicado",
        description: "Tu comentario se ha agregado correctamente.",
      });
    } catch (errorAlPublicar) {
      console.error("Error al publicar comentario:", errorAlPublicar);
      toast({
        title: "Error",
        description: "No se pudo publicar el comentario",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col border-border/80 bg-background/95 backdrop-blur-xl p-0">
        {/* encabezado */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-5 w-5 text-primary" />
            Comentarios {comments.length > 0 && `(${comments.length})`}
          </DialogTitle>
          <DialogDescription>
            Comparte tu opinión sobre esta publicación
          </DialogDescription>
        </DialogHeader>

        {/*lista de comentarios */}
        <div className="flex-1 overflow-hidden px-6">
          {isLoadingComments ? (
            // estado de carga
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            // estado vacío
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
              <div>
                <p className="font-medium text-foreground/80">
                  No hay comentarios aún
                </p>
                <p className="text-sm text-muted-foreground">
                  Sé el primero en comentar
                </p>
              </div>
            </div>
          ) : (
            // lista de comentarios
            <ScrollArea className="h-full pr-4" ref={scrollRef}>
              <div className="space-y-2 py-2">
                {comments.map((comentario, indice) => (
                  <CommentItem
                    key={comentario.id}
                    comment={comentario}
                    delay={indice}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* pie */}
        <div className="px-6 py-4 border-t border-border/40 bg-card/30">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              placeholder="Escribe un comentario..."
              value={newCommentText}
              onChange={(evento) => setNewCommentText(evento.target.value)}
              disabled={isSubmitting}
              className="min-h-[60px] max-h-[120px] resize-none"
            />
            <Button
              type="submit"
              disabled={!newCommentText.trim() || isSubmitting}
              className="self-end"
              size="icon"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};