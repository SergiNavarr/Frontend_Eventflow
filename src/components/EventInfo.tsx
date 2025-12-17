"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { CheckSquare, Heart, Users, AlertCircle } from "lucide-react";
import { EventDto, UserProfileDto } from "@/types";
import { EventService } from "@/services/event.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface EventInfoProps {
  event: EventDto;
  attendees: UserProfileDto[];
  onJoinChange: () => void;
}

export const EventInfo = ({ event, attendees, onJoinChange }: EventInfoProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isJoined = Boolean(event.myRsvpStatus);
  
  const isFull = event.maxAttendees 
    ? event.attendeesCount >= event.maxAttendees 
    : false;

  const handleJoinToggle = async () => {
    // Doble verificación de seguridad
    if (isFull && !isJoined) return;

    setLoading(true);
    try {
      if (isJoined) {
        await EventService.leaveEvent(event.id);
        toast({ title: "Has salido del evento" });
      } else {
        await EventService.joinEvent(event.id);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#EC4899'],
        });
        toast({ title: "¡Te has unido al evento! 🎉" });
      }
      onJoinChange();
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "No se pudo actualizar tu asistencia.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold">Sobre el evento</h3>
        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
          {event.description}
        </p>
      </Card>

      {/* Contador de Asistentes Mejorado */}
      <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
              isFull ? "bg-red-100 text-red-600 dark:bg-red-900/20" : "bg-primary/10 text-primary"
            }`}>
               {isFull ? <AlertCircle className="h-6 w-6" /> : <Users className="h-6 w-6" />}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                   {event.attendeesCount} 
                   {event.maxAttendees && <span className="text-muted-foreground"> / {event.maxAttendees}</span>}
                   {" "}Asistentes
                </h3>
                
                {/* Badge de estado */}
                {isFull && (
                  <Badge variant="destructive" className="ml-2">
                    Lleno
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                 {event.maxAttendees 
                    ? isFull 
                        ? "No quedan lugares disponibles." 
                        : `${event.maxAttendees - event.attendeesCount} lugares restantes.`
                    : "Entrada libre y capacidad ilimitada."}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/*Botón con Lógica de Bloqueo */}
      <Button
        className={`w-full py-6 text-lg font-bold shadow-lg transition-all ${
          isJoined
            ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            : isFull 
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
        }`}
        onClick={handleJoinToggle}
        disabled={loading || (isFull && !isJoined)}
      >
        {isJoined ? (
          <>
            <CheckSquare className="mr-2 h-5 w-5" /> 
            {event.myRsvpStatus === "Going" ? "Asistiré" : "Registrado"} 
          </>
        ) : isFull ? (
          <>
            <AlertCircle className="mr-2 h-5 w-5" /> Cupo Completo
          </>
        ) : (
          <>
            <Heart className="mr-2 h-5 w-5" /> Unirme al Evento
          </>
        )}
      </Button>
      
      {/* Mensaje extra si está lleno y no estoy unido */}
      {isFull && !isJoined && (
        <p className="text-center text-sm text-destructive">
          Lo sentimos, este evento ha alcanzado su capacidad máxima.
        </p>
      )}
    </div>
  );
};