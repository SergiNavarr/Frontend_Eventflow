"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Calendar, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Asegúrate de tener date-fns instalado
import { PostDto } from '@/types';
import { PostService } from '@/services/post.service';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

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

  // Formateo de fecha (Ej: "hace 5 minutos")
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true, 
    locale: es 
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
        variant: "destructive"
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
        <CardHeader className="flex flex-row items-start space-y-0 pb-3">
          {/* Avatar del Autor */}
          <div className="flex flex-1 gap-3">
            <Avatar className="h-10 w-10 border border-border/50 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={post.authorAvatar || undefined} alt={post.authorName} />
              <AvatarFallback>{post.authorName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm hover:underline cursor-pointer">
                  {post.authorName}
                </span>
                
                {/* Badge de Comunidad (si existe) */}
                {post.communityName && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {post.communityName}
                  </Badge>
                )}
              </div>
              
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
              className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-muted-foreground hover:text-primary'}`}
              onClick={handleLike}
              disabled={isLikeLoading}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{likesCount}</span>
            </Button>

            {/* Botón de Comentarios */}
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.commentsCount}</span>
            </Button>

            {/* Botón de Compartir */}
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};