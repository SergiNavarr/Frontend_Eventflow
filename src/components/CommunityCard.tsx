"use client";

import Link from "next/link";
import { Users, CheckCircle2 } from "lucide-react";
import { CommunityDto } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CommunityCardProps {
  community: CommunityDto;
  delay?: number;
}

export const CommunityCard = ({ community, delay = 0 }: CommunityCardProps) => {
  return (
    <Link href={`/communities/${community.id}`}>
      <Card className="group relative h-full overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-md cursor-pointer flex flex-col">
        
        {/* Portada Miniatura */}
        <div className="h-24 w-full bg-muted/50 overflow-hidden relative">
          {community.coverImageUrl ? (
            <img 
              src={community.coverImageUrl} 
              alt={community.name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
             <div className="h-full w-full bg-gradient-to-r from-primary/10 to-primary/5" />
          )}
          
          {/* Badge si ya soy miembro */}
          {community.isMember && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500/90 hover:bg-green-600 text-white gap-1 border-none shadow-sm">
                <CheckCircle2 className="h-3 w-3" />
                Miembro
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="relative pb-2 pt-0">
          {/* Avatar superpuesto */}
          <div className="-mt-10 mb-2">
            <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                {community.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-bold leading-none tracking-tight group-hover:text-primary transition-colors">
              {community.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              por {community.ownerName}
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {community.description}
          </p>
        </CardContent>

        <CardFooter className="border-t border-border/40 bg-muted/20 p-3">
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{community.memberCount} miembros</span>
            </div>
            <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100 font-medium">
              Ver comunidad →
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};