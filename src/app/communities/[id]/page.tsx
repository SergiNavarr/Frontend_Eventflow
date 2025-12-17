"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { CommunityService } from "@/services/community.service";
import { PostService } from "@/services/post.service";
import { CommunityDto, PostDto } from "@/types";

import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { PostCard } from "@/components/PostCard";
import { CreatePostWidget } from "@/components/CreatePostWidget";
import { CommunityHeader } from "@/components/CommunityHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { CreateEventDialog } from "@/components/CreateEventDialog";

export default function CommunityDetailPage() {
  const params = useParams();
  const { toast } = useToast();

  const [community, setCommunity] = useState<CommunityDto | null>(null);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);

  const rawId = params?.id;
  const communityId = rawId ? Number(Array.isArray(rawId) ? rawId[0] : rawId) : null;

  const fetchData = useCallback(async () => {
    if (!communityId) return;


    try {
      const [communityData, communityPosts] = await Promise.all([
        CommunityService.getCommunity(communityId),
        PostService.getPostsByCommunity(communityId)
      ]);

      setCommunity(communityData);
      setPosts(communityPosts);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo cargar la comunidad.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [communityId, toast]);

  useEffect(() => {
    if (communityId && !isNaN(communityId)) {
      fetchData();
    }
  }, [communityId, fetchData]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!community) return <div className="p-8 text-center">Comunidad no encontrada</div>;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-h-screen pb-24 md:ml-72 md:pb-8">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <CommunityHeader
                community={community}
                onJoinChange={fetchData}
              />
            </motion.div>

            <div className="px-4 pb-10">

              {community.isMember && (
                <div className="mb-8">
                  <CreatePostWidget
                    communityId={community.id}
                    onPostCreated={fetchData}
                  />
                </div>
              )}
              {community.isMember && (
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Actividad</h2>

                  <CreateEventDialog communityId={community.id} />
                </div>
              )}

              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Discusión
              </h2>

              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <PostCard key={post.id} post={post} delay={index * 0.1} />
                  ))
                ) : (
                  <div className="py-10 text-center text-muted-foreground bg-muted/20 rounded-xl">
                    No hay publicaciones en esta comunidad aún.
                  </div>
                )}
              </div>
            </div>

          </div>
        </ScrollArea>
        <BottomNav />
      </main>
    </div>
  );
}