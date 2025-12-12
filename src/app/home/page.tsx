"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// Componentes
import { PostCard } from '@/components/PostCard';
import { CreatePostWidget } from '@/components/CreatePostWidget';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast'; 

// Servicios y Tipos
import { PostService } from '@/services/post.service'; // Importamos solo PostService
import { PostDto } from '@/types'; // Importamos el DTO real

const Home = () => {
  // Ahora el estado es estrictamente un array de PostDto
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // 1. Establecer saludo
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos Días');
    else if (hour < 18) setGreeting('Buenas Tardes');
    else setGreeting('Buenas Noches');

    // 2. Cargar posts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Llamada directa al servicio de posts
      // Asumimos que getPosts sin argumentos trae el feed general ordenado por fecha
      const data = await PostService.getPosts(); 
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las publicaciones.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="min-h-screen pb-24 md:ml-72 md:pb-8">
        {/* Header con Saludo */}
        <div className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-2xl px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="flex items-center gap-2 text-3xl font-bold text-foreground">
                {greeting} <Sparkles className="h-6 w-6 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Descubre lo que está pasando en tu comunidad
              </p>
            </motion.div>
          </div>
        </div>

        {/* Feed Area */}
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-2xl px-4 py-6">
            
            {/* Widget para crear Post */}
            <div className="mb-6">
              {/* Pasamos fetchPosts para recargar la lista al publicar */}
              <CreatePostWidget onPostCreated={fetchPosts} /> 
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-12 w-12 text-primary" />
                </motion.div>
              </div>
            ) : (
              // Lista de Posts
              <div className="space-y-6">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <PostCard
                      key={`post-${post.id}`}
                      post={post} // Pasamos el PostDto completo
                      delay={index}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No hay publicaciones aún. ¡Sé el primero en escribir algo!
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        <BottomNav />
      </main>
    </div>
  );
};

export default Home;