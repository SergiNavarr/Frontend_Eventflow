"use client";

import { UserProfileDto } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CalendarDays,
  MapPin,
  Users,
  Edit,
  UserPlus,
  Check,
  UserCog,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useEffect } from "react";
import { UserService } from "@/services/user.service";
import { FollowersDialog } from "@/components/FollowersDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";

interface ProfileHeaderProps {
  profile: UserProfileDto;
  isOwnProfile: boolean;
  onProfileUpdate: () => void;
}

export const ProfileHeader = ({
  profile,
  isOwnProfile,
  onProfileUpdate,
}: ProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(profile.followersCount);

  useEffect(() => {
    setIsFollowing(profile.isFollowing || false);
    setFollowersCount(profile.followersCount);
  }, [profile]);

  // Función placeholder para seguir/dejar de seguir
  const handleFollowToggle = async () => {
    // Guardamos el estado anterior por si falla la API
    const wasFollowing = isFollowing;

    setIsFollowing(!wasFollowing);

    setFollowersCount((prev) => (wasFollowing ? prev - 1 : prev + 1));

    try {
      if (!wasFollowing) {
        await UserService.followUser(profile.id);
      } else {
        await UserService.unfollowUser(profile.id);
      }
      onProfileUpdate();
    } catch (error) {
      console.error("Error al seguir/dejar de seguir", error);
      // Revertir cambios en caso de error
      setIsFollowing(wasFollowing);
      setFollowersCount((prev) => (wasFollowing ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="relative mb-6">
      <div className="h-32 w-full overflow-hidden rounded-t-xl bg-gradient-to-r from-primary/20 to-primary/5 md:h-48"></div>

      <div className="px-4 pb-4">
        <div className="relative flex flex-col items-start">
          {/* Avatar superpuesto al banner */}
          <div className="-mt-12 mb-3 md:-mt-16">
            <Avatar className="h-24 w-24 border-4 border-background md:h-32 md:w-32">
              <AvatarImage
                src={profile.avatarUrl || undefined}
                alt={profile.username}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-muted">
                {profile.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Fila de Nombre y Botones de Acción */}
          <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {profile.username}
              </h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>

            {/* Botones de Acción Dinámicos */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <EditProfileDialog user={profile} onUpdate={onProfileUpdate}>
                  <Button className="w-full md:w-auto">
                    <UserCog className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Button>
                </EditProfileDialog>
              ) : (
                <Button
                  variant={isFollowing ? "secondary" : "default"}
                  size="sm"
                  className="gap-2"
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? (
                    <>
                      <Check className="h-4 w-4" /> Siguiendo
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" /> Seguir
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
              {profile.bio}
            </p>
          )}

          {/* Metadatos (Fecha, Ubicación, etc.) */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>
                Se unió en{" "}
                {format(new Date(profile.createdAt), "MMMM yyyy", {
                  locale: es,
                })}
              </span>
            </div>
          </div>

          {/* Contadores de Seguidores */}
          <div className="mt-4 flex gap-4 text-sm">
            {/* WRAPPER PARA "SIGUIENDO" */}
            <FollowersDialog
              userId={profile.id}
              initialTab="following"
              onUpdate={onProfileUpdate}
            >
              <div className="flex gap-1 hover:underline cursor-pointer">
                <span className="font-bold text-foreground">
                  {profile.followingCount}
                </span>
                <span className="text-muted-foreground">Siguiendo</span>
              </div>
            </FollowersDialog>

            {/* WRAPPER PARA "SEGUIDORES" */}
            <FollowersDialog
              userId={profile.id}
              initialTab="followers"
              onUpdate={onProfileUpdate}
            >
              <div className="flex gap-1 hover:underline cursor-pointer">
                <span className="font-bold text-foreground">
                  {profile.followersCount}
                </span>
                <span className="text-muted-foreground">Seguidores</span>
              </div>
            </FollowersDialog>
          </div>
        </div>
      </div>
    </div>
  );
};
