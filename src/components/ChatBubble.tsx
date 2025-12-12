import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Comment, User } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  comment: Comment;
  user: User;
  isCurrentUser?: boolean;
}

export const ChatBubble = ({ comment, user, isCurrentUser = false }: ChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3', isCurrentUser && 'flex-row-reverse')}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className={cn('flex flex-col gap-1', isCurrentUser && 'items-end')}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">{user.name}</span>
          <span>{format(comment.timestamp, 'h:mm a')}</span>
        </div>
        
        <div
          className={cn(
            'glass max-w-xs rounded-2xl px-4 py-2',
            isCurrentUser ? 'bg-primary/20' : 'bg-card/50'
          )}
        >
          <p className="text-sm text-foreground">{comment.text}</p>
        </div>
      </div>
    </motion.div>
  );
};
