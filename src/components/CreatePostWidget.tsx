import { useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockUsers } from '@/services/mockData';

export const CreatePostWidget = () => {
  const [activeTab, setActiveTab] = useState<'post' | 'event'>('post');
  const currentUser = mockUsers[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass sticky top-20 z-20 overflow-hidden rounded-2xl border-border/40 p-5">
        {/* User Avatar + Input */}
        <div className="mb-4 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/10">
            <AvatarImage src={currentUser.avatarUrl} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <button className="flex-1 rounded-full bg-muted px-4 py-2.5 text-left text-sm text-muted-foreground transition-all hover:bg-muted/80">
            ¿Qué está pasando?
          </button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'post' | 'event')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post" className="gap-2">
              <ImagePlus className="h-4 w-4" />
              Publicar Post
            </TabsTrigger>
            <TabsTrigger value="event" className="gap-2">
              <Calendar className="h-4 w-4" />
              Crear Evento
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ImagePlus className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" className="rounded-full px-6">
            {activeTab === 'post' ? 'Publicar' : 'Crear Evento'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
