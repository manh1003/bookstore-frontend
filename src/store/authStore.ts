import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRegistrationRequest } from '../types';
import { apiClient } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistrationRequest) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const response = await apiClient.post<{ token: string; user: User }>('/auth/login', {
            email,
            password,
          });
          
          const { token, user } = response;
          
          console.log('🔑 Login Response:', { token: token ? 'Present' : 'Missing', user });
          
          // Store token in localStorage
          localStorage.setItem('token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
          
        } catch (error) {
          console.error('❌ Login Error:', error);
          set({ loading: false });
          throw error;
        }
      },

      register: async (userData: UserRegistrationRequest) => {
        set({ loading: true });
        try {
          await apiClient.post<User>('/auth/register', userData);
          set({ loading: false });
          
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      getCurrentUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ loading: true });
        try {
          const user = await apiClient.get<User>('/auth/me');
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch {
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      
      clearAuth: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (user) => {
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...user } : user,
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);