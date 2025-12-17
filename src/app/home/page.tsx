"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

// Componentes
import { PostCard } from '@/components/PostCard';
import { CreatePostWidget } from '@/components/CreatePostWidget';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

import { PostService } from '@/services/post.service';
import { PostDto } from '@/types';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

const Home = () => {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true); 
  const [loadingMore, setLoadingMore] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos Días');
    else if (hour < 18) setGreeting('Buenas Tardes');
    else setGreeting('Buenas Noches');

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const PAGE_SIZE = 2;
      const data = await PostService.getFeedPosts(1, PAGE_SIZE);

      setPosts(data);

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setPage(2);
      }

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

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const PAGE_SIZE = 2;

      const data = await PostService.getFeedPosts(page, PAGE_SIZE);

      setPosts((prevPosts) => [...prevPosts, ...data]);

      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setPage((prevPage) => prevPage + 1);
      }

    } catch (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar más posts.', variant: 'destructive' });
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreRef = useIntersectionObserver(() => {
    if (!loadingMore && hasMore) {
      handleLoadMore();
    }
  });

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
              <CreatePostWidget onPostCreated={fetchPosts} />
            </div>

            {/* Loading State (Carga Inicial) */}
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
                  <>
                    {posts.map((post, index) => (
                      <PostCard
                        key={`post-${post.id}`}
                        post={post}
                        delay={index * 0.05}
                      />
                    ))}

                    {/*DETECTOR DE SCROLL INFINITO*/}
                    {hasMore && (
                      <div
                        ref={loadMoreRef}
                        className="flex items-center justify-center py-8 min-h-[60px]"
                      >
                        {/* Spinner inferior para cuando carga la siguiente página */}
                        {loadingMore && (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        )}
                      </div>
                    )}

                    {/* Mensaje de Fin de Lista */}
                    {!hasMore && posts.length > 5 && (
                      <p className="text-center text-xs text-muted-foreground py-4">
                        Has llegado al final. 🚀
                      </p>
                    )}
                  </>
                ) : (
                  // Estado Vacío
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