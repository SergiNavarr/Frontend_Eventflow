"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { PostCard } from '@/components/PostCard';
import { CreatePostWidget } from '@/components/CreatePostWidget';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { api } from '@/services/api';
import { FeedItem, User } from '@/types';
import { mockUsers } from '@/services/mockData';

const Home = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos Días');
    else if (hour < 18) setGreeting('Buenas Tardes');
    else setGreeting('Buenas Noches');

    // Fetch mixed feed
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    const data = await api.getFeed();
    setFeedItems(data);
    setLoading(false);
  };

  const getUserById = (userId: string): User => {
    return mockUsers.find(u => u.id === userId) || mockUsers[0];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-h-screen pb-24 md:ml-72 md:pb-8">
        {/* Header */}
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

        {/* Feed */}
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-2xl px-4 py-6">
            {/* Create Post Widget */}
            <div className="mb-6">
              <CreatePostWidget />
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
              <div className="space-y-6">
                {feedItems.map((item, index) => {
                  if (item.type === 'event') {
                    return (
                      <EventCard
                        key={`event-${item.data.id}`}
                        event={item.data}
                        friendsGoing={Math.floor(Math.random() * 10)}
                        delay={index}
                      />
                    );
                  } else {
                    const author = getUserById(item.data.authorId);
                    return (
                      <PostCard
                        key={`post-${item.data.id}`}
                        post={item.data}
                        author={author}
                        delay={index}
                      />
                    );
                  }
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Mobile Navigation */}
        <BottomNav />
      </main>
    </div>
  );
};

export default Home;
