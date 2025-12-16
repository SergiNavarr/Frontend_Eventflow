"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
// ... imports de UI ...
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

// Imports de Servicios y Tipos
import { UserService } from "@/services/user.service";
import { UserSummaryDto } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface FollowersDialogProps {
  userId: number;
  initialTab?: "followers" | "following";
  children: React.ReactNode;
  onUpdate?: () => void;
}

export function FollowersDialog({
  userId,
  initialTab = "followers",
  children,
  onUpdate,
}: FollowersDialogProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // AHORA USAMOS UserSummaryDto
  const [users, setUsers] = useState<UserSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchUsers(activeTab);
    }
  }, [open, activeTab, userId]);

  const fetchUsers = async (type: string) => {
    setLoading(true);
    setUsers([]);
    try {
      let data: UserSummaryDto[] = []; // Tipado correcto

      if (type === "followers") {
        data = await UserService.getFollowers(userId);
      } else {
        data = await UserService.getFollowing(userId);
      }
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  //Funcion auxiliar para cerrar el modal
  const handleClose = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="inline-block">{children}</div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center">Conexiones</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue={initialTab}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          <div className="px-6 border-b">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="followers">Seguidores</TabsTrigger>
              <TabsTrigger value="following">Seguidos</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            <TabsContent
              value="followers"
              className="m-0 space-y-4 focus-visible:ring-0"
            >
              {loading ? (
                <LoadingState />
              ) : (
                <UserList
                  users={users}
                  onUpdate={onUpdate}
                  onClose={handleClose}
                />
              )}
            </TabsContent>
            <TabsContent
              value="following"
              className="m-0 space-y-4 focus-visible:ring-0"
            >
              {loading ? (
                <LoadingState />
              ) : (
                <UserList
                  users={users}
                  onUpdate={onUpdate}
                  onClose={handleClose}
                />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Subcomponentes

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-10 space-y-2 text-muted-foreground">
    <Loader2 className="h-8 w-8 animate-spin" />
    <p className="text-sm">Cargando usuarios...</p>
  </div>
);

const UserList = ({
  users,
  onUpdate,
  onClose,
}: {
  users: UserSummaryDto[];
  onUpdate?: () => void;
  onClose: () => void;
}) => {
  if (users.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No se encontraron usuarios.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onUpdate={onUpdate}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// --- AQUÍ LA LÓGICA IMPORTANTE ---
const UserRow = ({
  user,
  onUpdate,
  onClose,
}: {
  user: UserSummaryDto;
  onUpdate?: () => void;
  onClose: () => void;
}) => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const isMe = currentUser?.id === user.id;

  const handleFollowToggle = async () => {
    if (!currentUser || isLoading) return;

    setIsLoading(true);
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      if (previousState) {
        await UserService.unfollowUser(user.id);
        toast({ description: `Dejaste de seguir a ${user.username}` });
      } else {
        await UserService.followUser(user.id);
        toast({ description: `Ahora sigues a ${user.username}` });
      }
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setIsFollowing(previousState);

      // Verificamos si es un error estándar para sacar el mensaje
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo realizar la acción.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between group">
      {/* USAMOS LINK PARA REDIRIGIR 
         - onClick={onClose} asegura que el modal se cierre
         - flex-1 toma el espacio disponible
         - min-w-0 permite que el truncate funcione
      */}
      <Link
        href={`/profile/${user.id}`}
        onClick={onClose}
        className="flex items-center gap-3 flex-1 hover:opacity-70 transition-opacity min-w-0 cursor-pointer"
      >
        <Avatar>
          <AvatarImage src={user.avatarUrl || undefined} />
          <AvatarFallback>
            {user.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium leading-none truncate group-hover:underline">
            {user.username}
          </span>
          {user.bio && (
            <span className="text-xs text-muted-foreground truncate">
              {user.bio}
            </span>
          )}
        </div>
      </Link>

      {currentUser && !isMe && (
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          onClick={handleFollowToggle}
          disabled={isLoading}
          className={`h-8 px-3 ${isFollowing ? "text-muted-foreground" : ""}`}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isFollowing ? (
            "Siguiendo"
          ) : (
            "Seguir"
          )}
        </Button>
      )}
    </div>
  );
};
