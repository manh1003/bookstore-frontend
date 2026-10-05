import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiError } from '../types/index';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
      timeout: 30000, // Tăng từ 10s lên 30s để tránh timeout khi gửi email
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor để thêm token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        console.log('🔍 API Request interceptor:', {
          url: config.url,
          method: config.method,
          hasToken: !!token,
          tokenStart: token?.substring(0, 20) + '...',
          headers: config.headers.Authorization ? 'Authorization header set' : 'No Authorization header'
        });
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor để handle errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const apiError: ApiError = {
          message: error.response?.data?.message || 'An error occurred',
          status: error.response?.status || 500,
          errors: error.response?.data?.errors,
        };

        // Nếu 401, clear token và redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Save the current location to redirect back after login
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            localStorage.setItem('redirectPath', currentPath);
          }
          window.location.href = '/login';
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }
}

export const apiClient = new ApiClient();