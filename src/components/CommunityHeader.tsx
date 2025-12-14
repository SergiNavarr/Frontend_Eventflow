"use client";

import { useState, useEffect } from "react";
import { CommunityDto } from "@/types";
import { CommunityService } from "@/services/community.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, LogIn, LogOut, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CommunityHeaderProps {
  community: CommunityDto;
  onJoinChange?: () => void;
}

export const CommunityHeader = ({ community, onJoinChange }: CommunityHeaderProps) => {
  const [isMember, setIsMember] = useState(community.isMember);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMember(community.isMember);
  }, [community.isMember]);

  const handleJoinToggle = async () => {
    setLoading(true);
    // UI Optimista: Cambiamos visualmente antes de que termine el fetch
    const previousState = isMember;
    setIsMember(!isMember); 

    try {
      if (previousState) {
        // Estaba dentro, quiero salir
        await CommunityService.leaveCommunity(community.id);
        toast({ title: "Saliste de la comunidad", description: `Ya no eres miembro.` });
      } else {
        // Estaba fuera, quiero entrar
        await CommunityService.joinCommunity(community.id);
        toast({ title: "¡Bienvenido!", description: `Te has unido exitosamente.` });
      }
      
      // Avisamos al padre para que recargue la data global (posts, widget, contadores)
      if (onJoinChange) {
         // Pequeño timeout para dar tiempo al back a procesar si es muy rápido
         setTimeout(() => onJoinChange(), 100); 
      }

    } catch (error) {
      // Si falla, revertimos el cambio visual
      setIsMember(previousState);
      toast({ 
        title: "Error", 
        description: "No se pudo actualizar tu membresía.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-6">
      {/* 1. Portada */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 md:h-56">
        {community.coverImageUrl && (
          <img 
            src={community.coverImageUrl} 
            alt="Cover" 
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 2. Info Principal */}
      <div className="px-4 pb-4">
        <div className="relative flex flex-col items-start">
          
          {/* Icono/Avatar de la comunidad */}
          <div className="-mt-10 mb-3 md:-mt-14">
            <Avatar className="h-20 w-20 border-4 border-background bg-background md:h-28 md:w-28 shadow-sm">
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                {community.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {community.name}
              </h1>
              
              {/* Badges de info */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Badge variant="secondary" className="gap-1 font-normal">
                  <Users className="h-3 w-3" />
                  {community.memberCount} miembros
                </Badge>
                <span>Creado por {community.ownerName}</span>
              </div>

              <p className="max-w-2xl text-base text-foreground/80 pt-2">
                {community.description}
              </p>
            </div>

            {/* Botón de Acción */}
            <Button 
              size="lg"
              className={`min-w-[140px] gap-2 transition-all ${
                isMember 
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" 
                  : ""
              }`}
              onClick={handleJoinToggle}
              disabled={loading}
            >
              {isMember ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Salir
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Unirse
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};