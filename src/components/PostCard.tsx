import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Post, User } from '@/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  author: User;
  delay?: number;
}

export const PostCard = ({ post, author, delay = 0 }: PostCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className="glass overflow-hidden rounded-2xl border-border/40 p-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 pb-4">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={author.avatarUrl} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{author.name}</h4>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(post.timestamp, { addSuffix: true, locale: es })}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed text-foreground">{post.content}</p>
        </div>

        {/* Image (if exists) */}
        {post.imageUrl && (
          <div className="relative aspect-video overflow-hidden">
            <motion.img
              src={post.imageUrl}
              alt="Post image"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 border-t border-border/40 p-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-muted-foreground hover:text-primary"
          >
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium">{post.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{post.commentCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-1 gap-2 text-muted-foreground hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-medium">Compartir</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
