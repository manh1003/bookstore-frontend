import { apiClient } from './api';
import type { Category, CreateCategoryRequest } from '../types';

export const categoryService = {
  getCategories: (activeOnly = false): Promise<Category[]> =>
    apiClient.get('/categories', { activeOnly }),

  getCategory: (id: number): Promise<Category> =>
    apiClient.get(`/categories/${id}`),

  getCategoryByName: (name: string): Promise<Category> =>
    apiClient.get(`/categories/name/${name}`),

  searchCategories: (keyword: string): Promise<Category[]> =>
    apiClient.get('/categories/search', { keyword }),

  // Admin only endpoints
  createCategory: (category: CreateCategoryRequest): Promise<Category> =>
    apiClient.post('/categories', category),

  updateCategory: (id: number, category: CreateCategoryRequest): Promise<Category> =>
    apiClient.put(`/categories/${id}`, category),

  activateCategory: (id: number): Promise<void> =>
    apiClient.put(`/categories/${id}/activate`),

  deactivateCategory: (id: number): Promise<void> =>
    apiClient.put(`/categories/${id}/deactivate`),

  deleteCategory: (id: number): Promise<void> =>
    apiClient.delete(`/categories/${id}`),
};