import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
  friendsGoing?: number;
  delay?: number;
}

const categoryColors: Record<Event['category'], string> = {
  party: 'bg-secondary',
  tech: 'bg-primary',
  sports: 'bg-green-500',
  music: 'bg-purple-500',
  food: 'bg-orange-500',
  art: 'bg-pink-500',
  networking: 'bg-blue-500',
};

export const EventCard = ({ event, friendsGoing = 0, delay = 0 }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
    >
      <Link href={`/event/${event.id}`}>
        <Card className="glass glass-hover overflow-hidden rounded-2xl border-0 p-0 transition-all duration-300 hover:scale-[1.02]">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.img
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            
            {/* Price Tag */}
            {event.price > 0 && (
              <div className="absolute right-3 top-3 glass rounded-full px-3 py-1">
                <span className="text-sm font-bold text-foreground">${event.price}</span>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute left-3 top-3">
              <Badge className={`${categoryColors[event.category]} border-0 text-white`}>
                {event.category.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 p-5">
            <h3 className="line-clamp-1 text-xl font-bold text-foreground">
              {event.title}
            </h3>
            
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{format(event.date, 'MMM d, h:mm a')}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>

            {/* Friends Going */}
            {friendsGoing > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  {friendsGoing} {friendsGoing === 1 ? 'friend' : 'friends'} going
                </span>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
