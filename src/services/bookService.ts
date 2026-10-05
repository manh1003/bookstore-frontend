import { apiClient } from './api';
import type { Book, CreateBookRequest, PageResponse } from '../types';

export const bookService = {
  // Public endpoints
  getBooks: (activeOnly = false): Promise<Book[]> =>
    apiClient.get('/books', { activeOnly }),

  // Paginated endpoint
  getBooksPaginated: (params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
    activeOnly?: boolean;
    categoryId?: number;
    search?: string;
  }): Promise<PageResponse<Book>> => {
    const queryParams = {
      page: params.page || 0,
      size: params.size || 10,
      sortBy: params.sortBy || 'title',
      sortDirection: params.sortDirection || 'asc',
      activeOnly: params.activeOnly || false,
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.search && { search: params.search })
    };
    return apiClient.get('/books/paginated', queryParams);
  },

  getBook: (id: number): Promise<Book> =>
    apiClient.get(`/books/${id}`),

  getAvailableBooks: (): Promise<Book[]> =>
    apiClient.get('/books/available'),

  getBooksByCategory: (categoryId: number): Promise<Book[]> =>
    apiClient.get(`/books/category/${categoryId}`),

  searchBooks: (keyword: string): Promise<Book[]> =>
    apiClient.get('/books/search', { keyword }),

  searchBooksByTitle: (title: string): Promise<Book[]> =>
    apiClient.get('/books/search/title', { title }),

  searchBooksByAuthor: (author: string): Promise<Book[]> =>
    apiClient.get('/books/search/author', { author }),

  getBookByIsbn: (isbn: string): Promise<Book> =>
    apiClient.get(`/books/isbn/${isbn}`),

  // Admin only endpoints
  createBook: (book: CreateBookRequest): Promise<Book> =>
    apiClient.post('/books', book),

  updateBook: (id: number, book: CreateBookRequest): Promise<Book> =>
    apiClient.put(`/books/${id}`, book),

  updateBookStock: (id: number, quantity: number): Promise<Book> =>
    apiClient.put(`/books/${id}/stock?quantity=${quantity}`),

  activateBook: (id: number): Promise<void> =>
    apiClient.put(`/books/${id}/activate`),

  deactivateBook: (id: number): Promise<void> =>
    apiClient.put(`/books/${id}/deactivate`),

  deleteBook: (id: number): Promise<void> =>
    apiClient.delete(`/books/${id}`),
};