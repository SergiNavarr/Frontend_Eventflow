"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Loader2 } from "lucide-react";

import { CommunityService } from "@/services/community.service";
import { CommunityDto } from "@/types";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { CommunityCard } from "@/components/CommunityCard"; 
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CreateCommunityDialog } from "@/components/CreateCommunityDialog";

export default function CommunitiesPage() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [communities, setCommunities] = useState<CommunityDto[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<CommunityDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    const results = communities.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCommunities(results);
  }, [searchTerm, communities]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);

      const data = await CommunityService.getAllCommunities();
      setCommunities(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las comunidades.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-h-screen pb-24 md:ml-72 md:pb-8">
        
        {/* Header Fijo con Buscador */}
        <div className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-5xl px-6 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                  Comunidades <Users className="h-6 w-6 text-primary" />
                </h1>
                <p className="text-sm text-muted-foreground">
                  Explora grupos, únete a conversaciones y conecta con gente.
                </p>
              </div>

              {/* Botón Crear*/}
              {isAuthenticated && (
                <CreateCommunityDialog />
              )}
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative mt-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Buscar comunidades por nombre o descripción..." 
                className="pl-10 bg-muted/40 border-border/50 h-12 text-base focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Grilla de Resultados */}
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-5xl px-6 py-8">
            
            {loading ? (
              <div className="flex h-60 items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Mostrando {filteredCommunities.length} comunidades
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCommunities.length > 0 ? (
                    filteredCommunities.map((community, index) => (
                      <motion.div
                        key={community.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <CommunityCard community={community} />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                        <Search className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No se encontraron resultados</h3>
                      <p className="text-muted-foreground">
                        Intenta con otro término de búsqueda.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <BottomNav />
      </main>
    </div>
  );
}