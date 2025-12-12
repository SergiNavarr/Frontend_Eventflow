"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '@/services/user.service';
import { UserProfileDto, UserLoginDto, UserRegisterDto } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: UserProfileDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: UserLoginDto) => Promise<void>;
  register: (data: UserRegisterDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Al cargar la app, verificamos si hay token y recuperamos el usuario
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Usamos el servicio que definimos para obtener "mi perfil"
          const userProfile = await UserService.getProfile(); 
          setUser(userProfile);
        } catch (error) {
          console.error("Sesión expirada o inválida", error);
          logout(); // Si falla, limpiamos todo
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: UserLoginDto) => {
    try {
      // 1. Llamamos al endpoint de Login
      const response = await UserService.login(data);
      
      // 2. Guardamos el token recibido
      // Nota: Asegúrate de que response.token exista. 
      // Si tu back devuelve { "token": "..." } usa response.token
      if (!response.token) throw new Error("No se recibió token del servidor");
      
      localStorage.setItem('token', response.token);
      
      // 3. ¡CORRECCIÓN AQUÍ! 
      // En lugar de usar response.user, hacemos fetch del perfil con el token nuevo.
      // Esto asegura que tengamos el objeto UserProfileDto completo y correcto.
      const userProfile = await UserService.getProfile(); 
      
      // 4. Guardamos el usuario en el estado
      setUser(userProfile);
      
      toast({ title: "Bienvenido de nuevo", description: `Hola, ${userProfile.username}!` });
      router.push('/'); 
      
    } catch (error: any) {
      console.error(error);
      toast({ 
        title: "Error de acceso", 
        description: error.message || "Credenciales incorrectas", 
        variant: "destructive" 
      });
      // Importante: Si falló algo después de guardar el token (ej: getProfile), limpiar.
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const register = async (data: UserRegisterDto) => {
    try {
      await UserService.register(data);
      toast({ title: "Cuenta creada", description: "Ahora puedes iniciar sesión." });
      // Opcional: Auto-login aquí o redirigir a /login
      router.push('/login');
    } catch (error: any) {
      toast({ 
        title: "Error de registro", 
        description: error.message || "No se pudo crear la cuenta", 
        variant: "destructive" 
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
    toast({ title: "Sesión cerrada", description: "¡Hasta pronto!" });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};