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


  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userProfile = await UserService.getProfile(); 
          setUser(userProfile);
        } catch (error) {
          console.error("Sesión expirada o inválida", error);
          logout(); 
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: UserLoginDto) => {
    try {
      const response = await UserService.login(data);


      if (!response.token) throw new Error("No se recibió token del servidor");
      
      localStorage.setItem('token', response.token);
      
      const userProfile = await UserService.getProfile(); 
      
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
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const register = async (data: UserRegisterDto) => {
    try {
      await UserService.register(data);
      toast({ title: "Cuenta creada", description: "Ahora puedes iniciar sesión." });
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