"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Share2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventDto } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EventHeaderProps {
  event: EventDto;
}

export const EventHeader = ({ event }: EventHeaderProps) => {
  const router = useRouter();

  return (
    <>
      <div className="relative h-64 w-full overflow-hidden md:h-96">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />
        
        {event.coverImageUrl ? (
          <img
            src={event.coverImageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted/30 flex items-center justify-center">
             <span className="text-muted-foreground">Sin portada</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 z-20 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 text-white"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="relative z-20 -mt-12 px-4 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
              {/* Fecha */}
              <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="capitalize">
                    {format(new Date(event.startDateTime), "PPP p", { locale: es })}
                </span>
              </div>
              
              {/* Ubicación */}
              <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
                {event.isOnline ? (
                    <Video className="h-4 w-4 text-blue-500" />
                ) : (
                    <MapPin className="h-4 w-4 text-red-500" />
                )}
                <span>{event.location}</span>
              </div>

              {/* Organizador */}
              <div className="flex items-center gap-1 px-2">
                 <span>Organizado por <strong>{event.organizerName}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};