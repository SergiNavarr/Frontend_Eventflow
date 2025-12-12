import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, MessageSquare, Users, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { api } from '@/services/api';
import { Community } from '@/types';
import { mockUsers } from '@/services/mockData';

export const Sidebar = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const currentUser = mockUsers[0]; // Simulating logged-in user

  useEffect(() => {
    const fetchCommunities = async () => {
      const data = await api.getCommunities();
      setCommunities(data);
    };
    fetchCommunities();
  }, []);

  const navItems = [
    { icon: Home, label: 'Inicio', active: true },
    { icon: MessageSquare, label: 'Mensajes', badge: 3 },
    { icon: Users, label: 'Amigos' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-border bg-card/50 backdrop-blur-xl md:block">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-6 p-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={currentUser.avatarUrl} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{currentUser.name}</h3>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
          </motion.div>

          <Separator />

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </motion.button>
            ))}
          </nav>

          <Separator />

          {/* My Communities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">Mis Comunidades</h4>
            </div>

            <div className="space-y-2">
              {communities.map((community, index) => (
                <motion.button
                  key={community.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex w-full items-center gap-3 rounded-xl p-2 text-sm transition-all hover:bg-muted"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={community.iconUrl} />
                    <AvatarFallback>{community.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{community.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {community.memberCount.toLocaleString()} miembros
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Explore Communities Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              Explorar Comunidades
            </motion.button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
