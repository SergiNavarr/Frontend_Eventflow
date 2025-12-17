"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { UserService } from "@/services/user.service";
import { EventService } from "@/services/event.service";
import { CommunityService } from "@/services/community.service";


import { UserProfileDto, EventDto, CommunityDto } from "@/types";

import { EventCard } from "@/components/EventCard"; 
import { CommunityCard } from "@/components/CommunityCard"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("events"); // 'users' | 'communities' | 'events'
  const [loading, setLoading] = useState(false);

  // Estados de resultados
  const [users, setUsers] = useState<UserProfileDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [communities, setCommunities] = useState<CommunityDto[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        // Limpiar si borra el texto
        setUsers([]);
        setEvents([]);
        setCommunities([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, activeTab]);

  const performSearch = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "users":
          const usersRes = await UserService.searchUsers(query);
          setUsers(usersRes);
          break;
        case "communities":
          const commsRes = await CommunityService.searchCommunities(query);
          setCommunities(commsRes);
          break;
        case "events":
          const eventsRes = await EventService.searchEvents(query);
          setEvents(eventsRes);
          break;
      }
    } catch (error) {
      console.error("Error buscando:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Sidebar />
      <main className="md:ml-72 min-h-screen flex flex-col">
        
        {/* Header Fijo con Buscador */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border p-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar en EventFlow..." 
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* Tabs */}
          <div className="max-w-2xl mx-auto mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="events">Eventos</TabsTrigger>
                <TabsTrigger value="communities">Comunidades</TabsTrigger>
                <TabsTrigger value="users">Personas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Área de Resultados */}
        <ScrollArea className="flex-1">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !query ? (
              <div className="text-center py-20 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Escribe algo para comenzar a explorar.</p>
              </div>
            ) : (
              <>
                {/* 1. RESULTADOS DE EVENTOS */}
                {activeTab === "events" && (
                  <div className="space-y-4">
                    {events.length > 0 ? (
                      events.map(event => (
                        <EventCard key={event.id} event={event} />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-10">No se encontraron eventos.</p>
                    )}
                  </div>
                )}

                {/* 2. RESULTADOS DE COMUNIDADES */}
                {activeTab === "communities" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {communities.length > 0 ? (
                      communities.map(community => (
                        <CommunityCard key={community.id} community={community} />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-10 col-span-2">No se encontraron comunidades.</p>
                    )}
                  </div>
                )}

                {/* 3. RESULTADOS DE USUARIOS */}
                {activeTab === "users" && (
                  <div className="space-y-2">
                    {users.length > 0 ? (
                      users.map(user => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50">
                          <Link href={`/profile/${user.id}`} className="flex items-center gap-3 flex-1">
                            <Avatar>
                              <AvatarImage src={user.avatarUrl || undefined} />
                              <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-foreground">{user.username}</p>
                                <p className="text-xs text-muted-foreground">
                                    {user.followersCount} seguidores
                                </p>
                            </div>
                          </Link>
                          <Link href={`/profile/${user.id}`}>
                             <Button variant="ghost" size="sm">Ver Perfil</Button>
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-10">No se encontraron usuarios.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </main>
      <BottomNav />
    </div>
  );
}