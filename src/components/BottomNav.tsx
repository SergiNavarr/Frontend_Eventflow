"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Users, Calendar, User, LogIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const BottomNav = () => {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { 
      label: "Inicio", 
      href: "/", 
      icon: Home 
    },
    { 
      label: "Explorar", 
      href: "/explore", 
      icon: Compass 
    },
    { 
      label: "Comunidad", 
      href: "/communities", 
      icon: Users 
    },
    { 
      label: "Eventos", 
      href: "/event", 
      icon: Calendar 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-border/40 bg-background/80 backdrop-blur-xl md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        
        {/* 1. Items de Navegación Estándar */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* 2. Item de Perfil Dinámico */}
        {isAuthenticated && user ? (
          <Link
            href={`/profile/${user.id}`}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors",
              pathname.startsWith("/profile") 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Avatar className="h-6 w-6 border border-border">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="text-[9px]">
                {user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-medium">Yo</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-colors",
              pathname === "/login" 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LogIn className="h-6 w-6" />
            <span className="text-[10px] font-medium">Entrar</span>
          </Link>
        )}
      </nav>
    </div>
  );
};