import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EventChatMessageDto } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface ChatBubbleProps {
  message: EventChatMessageDto;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isCurrentUser = message.isMine;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 w-full', 
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0 mt-1 border border-border/50">
        <AvatarImage src={message.senderAvatar || undefined} alt={message.senderName} />
        <AvatarFallback className="bg-muted text-[10px]">
           {message.senderName ? message.senderName.substring(0, 2).toUpperCase() : <User className="h-4 w-4"/>}
        </AvatarFallback>
      </Avatar>

      {/* Contenido del Mensaje */}
      <div className={cn('flex flex-col gap-1 max-w-[75%]', isCurrentUser ? 'items-end' : 'items-start')}>
        
        {/* Nombre y Hora */}
        <div className={cn("flex items-center gap-2 text-[10px] text-muted-foreground", isCurrentUser && "flex-row-reverse")}>
          <span className="font-medium opacity-90">{message.senderName}</span>
          <span>{format(new Date(message.createdAt), 'h:mm a')}</span>
        </div>
        
        {/* Burbuja */}
        <div
          className={cn(
            'px-4 py-2 rounded-2xl shadow-sm text-sm break-words',
            isCurrentUser 
              ? 'bg-primary text-primary-foreground rounded-tr-sm' 
              : 'bg-card border border-border/50 text-foreground rounded-tl-sm' 
          )}
        >
          <p className="leading-relaxed">{message.content}</p>
        </div>
      </div>
    </motion.div>
  );
};