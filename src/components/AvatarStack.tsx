import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types';
import { cn } from '@/lib/utils';

interface AvatarStackProps {
  users: User[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarStack = ({ users, max = 3, size = 'md' }: AvatarStackProps) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  return (
    <div className="flex items-center -space-x-3">
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.id}
          className={cn(sizeClasses[size], "border-2 border-background")}
          style={{ zIndex: displayUsers.length - index }}
        >
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      
      {remainingCount > 0 && (
        <div className={cn(
          sizeClasses[size],
          "flex items-center justify-center rounded-full border-2 border-background bg-muted font-medium text-muted-foreground"
        )}>
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
