import { apiClient } from './api';
import type { LoginRequest, LoginResponse, UserRegistrationRequest, User } from '../types';

export const authService = {
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    apiClient.post('/auth/login', credentials),

  register: (userData: UserRegistrationRequest): Promise<User> =>
    apiClient.post('/auth/register', userData),

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.roles?.includes('ADMIN') ?? false;
  },

  setAuthData: (loginResponse: LoginResponse): void => {
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('user', JSON.stringify(loginResponse.user));
  },
};