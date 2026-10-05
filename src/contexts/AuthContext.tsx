import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { apiClient } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      console.log('🔄 AuthProvider - Initializing...');
      
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('📦 AuthProvider - Stored data:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        tokenStart: storedToken?.substring(0, 20) + '...'
      });

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          setToken(storedToken);
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('✅ AuthProvider - Auth restored from localStorage');
        } catch (error) {
          console.error('❌ AuthProvider - Failed to restore auth:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 AuthProvider - Logging in...');
      
      const response = await apiClient.post<{ token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: newUser } = response;
      
      console.log('✅ AuthProvider - Login successful:', {
        hasToken: !!newToken,
        userEmail: newUser.email,
        tokenStart: newToken?.substring(0, 20) + '...'
      });

      // Store in state first
      setToken(newToken);
      setUser(newUser);

      // Then store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Verify storage
      const verifyToken = localStorage.getItem('token');
      const verifyUser = localStorage.getItem('user');
      console.log('🔍 AuthProvider - Storage verification:', {
        tokenStored: !!verifyToken,
        userStored: !!verifyUser
      });

    } catch (error) {
      console.error('❌ AuthProvider - Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 AuthProvider - Logging out...');
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    console.log('✅ AuthProvider - Logged out successfully');
  };

  const updateUser = (updatedUser: User) => {
    console.log('📝 AuthProvider - Updating user:', updatedUser.email);
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = !!(user && token);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser,
  };

  console.log('🔍 AuthProvider - Current state:', {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated,
    loading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};