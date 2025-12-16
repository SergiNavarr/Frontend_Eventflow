import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { EventDto } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface EventCardProps {
  event: EventDto;
  delay?: number;
}

export const EventCard = ({ event, delay = 0 }: EventCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
    >
      <Link href={`/event/${event.id}`}>
        <Card className="group overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50">
          
          {/* Imagen de Portada */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.img
              src={event.coverImageUrl || '/placeholder.svg'}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            
            <div className="absolute left-3 top-3">
              <Badge variant={event.isOnline ? "secondary" : "default"} className="font-semibold shadow-sm">
                {event.isOnline ? 'Online' : 'Presencial'}
              </Badge>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-3 p-5">
            <h3 className="line-clamp-1 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            
            <p className="line-clamp-2 text-sm text-muted-foreground min-h-[40px]">
              {event.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {/* Fecha */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="capitalize">
                    {/* Convertir el string ISO a Date */}
                    {format(new Date(event.startDateTime), 'MMM d, h:mm a', { locale: es })}
                </span>
              </div>
              
              {/* Ubicación */}
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="line-clamp-1">{event.location}</span>
              </div>

              {/* Asistentes */}
              {event.attendeesCount > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">
                    {event.attendeesCount} asistentes
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};