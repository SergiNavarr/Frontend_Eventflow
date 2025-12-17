"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { UserService } from "@/services/user.service";
import { PostService } from "@/services/post.service";
import { UserProfileDto, PostDto } from "@/types";
import { useAuth } from "@/context/AuthContext";

import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { PostCard } from "@/components/PostCard";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);

  const profileId = params.id ? Number(params.id) : null;

  const isOwnProfile = currentUser?.id === profileId;

  useEffect(() => {
    if (profileId) {
      fetchProfileData(profileId, true);
    }
  }, [profileId]);

  const fetchProfileData = async (id: number, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [userProfile, userPosts] = await Promise.all([
        UserService.getProfile(id),
        PostService.getPostsByUser(id),
      ]);

      setProfile(userProfile);
      setPosts(userPosts);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo cargar el perfil del usuario.",
        variant: "destructive",
      });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    if (profileId) {
      fetchProfileData(profileId, false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="min-h-screen pb-24 md:ml-72 md:pb-8">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-3xl">
            {/* Header del Perfil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ProfileHeader
                profile={profile}
                isOwnProfile={isOwnProfile}
                onProfileUpdate={handleProfileUpdate}
              />
            </motion.div>

            {/* Lista de Publicaciones del Usuario */}
            <div className="px-4 pb-10">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Publicaciones
              </h2>

              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <PostCard key={post.id} post={post} delay={index * 0.1} />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border/60 p-8 text-center">
                    <p className="text-muted-foreground">
                      {isOwnProfile
                        ? "Aún no has publicado nada."
                        : `@${profile.username} aún no ha publicado nada.`}
                    </p>
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
