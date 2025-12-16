"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Users,
  Calendar,
  User,
  LogOut,
  LogIn,
  PlusCircle,
  Settings
} from "lucide-react";

import { cn } from "@/lib/utils"; // Asegúrate de tener esta utilidad (típica de shadcn/ui)
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";

// Definimos los items del menú principal
const menuItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Compass, label: "Explorar", href: "/explore" },
  { icon: Users, label: "Comunidades", href: "/communities" },
  { icon: Calendar, label: "Eventos", href: "/event" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  // Extraemos la data y funciones del contexto
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-border/40 bg-background/95 backdrop-blur-xl md:flex md:flex-col">

      {/* 1. Logo */}
      <div className="flex h-20 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-5 w-5 object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">EventFlow</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between px-4 pb-6">

        {/* 2. Navegación Principal */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-base font-normal",
                    isActive && "font-medium"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}

          {/* Enlace al Perfil Propio (Solo si está logueado) */}
          {isAuthenticated && (
            <Link href={`/profile/${user?.id}`}>
              <Button
                variant={pathname.startsWith('/profile') ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 text-base font-normal"
              >
                <User className="h-5 w-5" />
                Perfil
              </Button>
            </Link>
          )}
        </nav>

        {/* 3. Área de Usuario (Footer del Sidebar) */}
        <div className="space-y-4">

          <Separator className="bg-border/50" />

          {isLoading ? (
            // Skeleton / Loading state
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ) : isAuthenticated && user ? (
            // --- ESTADO: LOGUEADO ---
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarImage src={user.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium">
                    {user.username}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  size="sm"
                >
                  <Settings className="h-4 w-4" />
                  Configuración
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  size="sm"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          ) : (
            // --- ESTADO: NO LOGUEADO ---
            <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-4">
              <div className="text-sm font-medium">
                Únete a EventFlow
              </div>
              <p className="text-xs text-muted-foreground">
                Inicia sesión para interactuar, crear eventos y seguir comunidades.
              </p>
              <div className="grid gap-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button size="sm" className="w-full">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};