"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { CommentDto } from "@/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentItemProps {
  comment: CommentDto;
  delay?: number;
}

export const CommentItem = ({ comment, delay = 0 }: CommentItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.05 }}
      className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
    >
      {/* avatar */}
      <Avatar className="h-8 w-8 border border-border/50 flex-shrink-0">
        <AvatarImage src={comment.authorAvatar || undefined} alt={comment.authorName} />
        <AvatarFallback className="text-xs">
          {comment.authorName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* contenido */}
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm hover:underline cursor-pointer">
            {comment.authorName}
          </span>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>

        {/* texto */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground/90">
          {comment.content}
        </p>
      </div>
    </motion.div>
  );
};