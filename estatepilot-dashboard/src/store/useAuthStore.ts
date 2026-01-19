import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  admin: {
    id: string;
    email: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  
  setToken: (token: string) => void;
  setAdmin: (admin: any) => void;
  logout: () => void;
}

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'estatepilot_token';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,
      isAuthenticated: false,
      
      setToken: (token: string) => {
        Cookies.set(TOKEN_KEY, token, { expires: 7 });
        set({ token, isAuthenticated: true });
      },
      
      setAdmin: (admin: any) => {
        set({ admin });
      },
      
      logout: () => {
        Cookies.remove(TOKEN_KEY);
        set({ 
          token: null, 
          admin: null, 
          isAuthenticated: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
