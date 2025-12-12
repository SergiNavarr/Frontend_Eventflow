"use client";

import { motion } from 'framer-motion';
import { Home, Search, PlusCircle, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: PlusCircle, label: 'Create', path: '/create' },
  { icon: Calendar, label: 'Events', path: '/my-events' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
    >
      <div className="glass rounded-full px-4 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  className={cn(
                    'rounded-full p-2 transition-colors',
                    isActive && 'bg-primary'
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon
                    className={cn(
                      'h-6 w-6 transition-colors',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  />
                </motion.div>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};
