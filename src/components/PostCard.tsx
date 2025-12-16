"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Calendar,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { PostDto } from "@/types";
import { PostService } from "@/services/post.service";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { CommentsDialog } from "./CommentsDialog";

interface PostCardProps {
  post: PostDto;
  delay?: number;
}

export const PostCard = ({ post, delay = 0 }: PostCardProps) => {
  const { toast } = useToast();

  // Estado local para UI optimista (actualizamos visualmente antes de que responda la API)
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);

  // Formateo de fecha (Ej: "hace 5 minutos")
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: es,
  });

  const handleLike = async () => {
    if (isLikeLoading) return;

    // UI Optimista: Asumimos que funcionará
    const previousLiked = isLiked;
    const previousCount = likesCount;

    setIsLiked(!previousLiked);
    setLikesCount(previousLiked ? previousCount - 1 : previousCount + 1);
    setIsLikeLoading(true);

    try {
      await PostService.likePost(post.id);
    } catch (error) {
      // Si falla, revertimos
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast({
        title: "Error",
        description: "No se pudo procesar tu 'Me gusta'.",
        variant: "destructive",
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-border/80 hover:shadow-sm">
        <CardHeader className="flex flex-row items-gap-4 p-4 pb-2">
          {/* Avatar del Autor */}
          <Link
            href={`/profile/${post.authorId}`}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarImage
                src={post.authorAvatar || undefined}
                alt={post.authorName}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.authorName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              {/* Agregamos group-hover:underline para efecto visual */}
              <span className="font-semibold text-foreground text-sm group-hover:underline decoration-primary decoration-2 underline-offset-2">
                {post.authorName}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: es,
                })}
              </span>
            </div>
          </Link>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          {/* Referencia a Evento (Si el post habla de un evento) */}
          {post.eventId && post.eventTitle && (
            <div className="mb-2 rounded-md bg-primary/5 border border-primary/10 p-2 flex items-center gap-2 text-sm text-primary">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Relacionado al evento: </span>
              <span className="underline cursor-pointer hover:text-primary/80">
                {post.eventTitle}
              </span>
            </div>
          )}

          {/* Contenido Texto */}
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {post.content}
          </p>

          {/* Contenido Imagen */}
          {post.imageUrl && (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-border/50 bg-muted/30">
              <img
                src={post.imageUrl}
                alt="Post content"
                className="h-auto w-full object-cover max-h-[500px]"
                loading="lazy"
              />
            </div>
          )}
        </CardContent>

        {/* Acciones (Footer) */}
        <CardFooter className="border-t border-border/40 py-2">
          <div className="flex w-full items-center justify-between">
            {/* Botón de Like */}
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${
                isLiked
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                  : "text-muted-foreground hover:text-primary"
              }`}
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-xs">{likesCount}</span>
            </Button>

            {/* Botón de Comentarios */}
            <CommentsDialog
              postId={post.id}
              initialCommentsCount={commentsCount}
              onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
            >
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{commentsCount}</span>
              </Button>
            </CommentsDialog>

            {/* Botón de Compartir */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-primary"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
