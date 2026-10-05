import { apiClient } from './api';
import type { Book, Category, User, Order, CreateBookRequest, CreateCategoryRequest } from '../types';

// A generic type for paginated responses from the backend
export interface PaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}

// Dashboard stats types
export interface DashboardStats {
  totalBooks: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockBooks: number;
  categoryStats: CategoryStats[];
  recentOrders: RecentOrder[];
}

export interface CategoryStats {
  categoryName: string;
  bookCount: number;
  totalRevenue: number;
}

export interface RecentOrder {
  orderId: number;
  customerName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export const adminService = {
  // =================================================================
  // Dashboard
  // =================================================================
  getDashboardStats: (): Promise<DashboardStats> => {
    return apiClient.get('/admin/dashboard/stats');
  },
  // =================================================================
  // Book Management
  // =================================================================
  getBooks: (search = ''): Promise<Book[]> => {
    return apiClient.get('/books', { params: search ? { search } : {} });
  },
  createBook: (bookData: CreateBookRequest): Promise<Book> => {
    return apiClient.post('/books', bookData);
  },
  updateBook: (id: number, bookData: Partial<CreateBookRequest>): Promise<Book> => {
    return apiClient.put(`/books/${id}`, bookData);
  },
  deleteBook: (id: number): Promise<void> => {
    return apiClient.delete(`/books/${id}`);
  },

  // =================================================================
  // Category Management
  // =================================================================
  getCategories: (): Promise<Category[]> => {
    return apiClient.get('/categories');
  },
  createCategory: (categoryData: CreateCategoryRequest): Promise<Category> => {
    return apiClient.post('/categories', categoryData);
  },
  updateCategory: (id: number, categoryData: Partial<CreateCategoryRequest>): Promise<Category> => {
    return apiClient.put(`/categories/${id}`, categoryData);
  },
  deleteCategory: (id: number): Promise<void> => {
    return apiClient.delete(`/categories/${id}`);
  },

  // =================================================================
  // User Management
  // =================================================================
  getUsers: (): Promise<User[]> => {
    return apiClient.get('/admin/users');
  },
  activateUser: (id: number): Promise<void> => {
    return apiClient.put(`/admin/users/${id}/activate`);
  },
  deactivateUser: (id: number): Promise<void> => {
    return apiClient.put(`/admin/users/${id}/deactivate`);
  },
  deleteUser: (id: number): Promise<void> => {
    return apiClient.delete(`/admin/users/${id}`);
  },

  // =================================================================
  // Order Management
  // =================================================================
  getOrders: (status?: string): Promise<Order[]> => {
    return apiClient.get('/orders', { params: status ? { status } : {} });
  },
  updateOrderStatus: (id: number, status: string): Promise<Order> => {
    return apiClient.put(`/orders/${id}/status`, { status });
  },
};