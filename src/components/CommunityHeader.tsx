"use client";

import { useState, useEffect } from "react";
import { CommunityDto } from "@/types";
import { CommunityService } from "@/services/community.service";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, LogIn, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EditCommunityDialog } from "@/components/EditCommunityDialog";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface CommunityHeaderProps {
  community: CommunityDto;
  onJoinChange?: () => void;
}

export const CommunityHeader = ({
  community,
  onJoinChange,
}: CommunityHeaderProps) => {
  const [isMember, setIsMember] = useState(community.isMember);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const isCreator = user?.id === community.ownerId;

  useEffect(() => {
    setIsMember(community.isMember);
  }, [community.isMember]);

  const handleJoinToggle = async () => {
    setLoading(true);
    const previousState = isMember;
    setIsMember(!isMember);

    try {
      if (previousState) {
        // Estaba dentro, quiero salir
        await CommunityService.leaveCommunity(community.id);
        toast({
          title: "Saliste de la comunidad",
          description: `Ya no eres miembro.`,
        });
      } else {
        // Estaba fuera, quiero entrar
        await CommunityService.joinCommunity(community.id);
        toast({
          title: "¡Bienvenido!",
          description: `Te has unido exitosamente.`,
        });
      }

      // Avisamos al padre para que recargue la data global
      if (onJoinChange) {
        // Pequeño timeout para dar tiempo al back a procesar si es muy rápido
        setTimeout(() => onJoinChange(), 100);
      }
    } catch (error) {
      setIsMember(previousState);
      toast({
        title: "Error",
        description: "No se pudo actualizar tu membresía.",
        variant: "destructive",
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
      <div className="px-4 pb-4 pt-4">
        <div className="relative flex flex-col items-start">
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
            <div className="flex items-center gap-3">
              {isCreator && (
                <EditCommunityDialog
                  community={community}
                  onCommunityUpdated={() => router.refresh()}
                />
              )}

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
    </div>
  );
};
