export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  price: number;
  currency: string;
  stockQuantity: number;
  categoryName: string;
  categoryId: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  bookCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  role: 'CUSTOMER' | 'ADMIN'; // Enum from backend
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Order {
  id: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  currency: string;
  shippingAddress: string;
  phoneNumber?: string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
  orderItems: OrderItem[];
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  bookTitle: string;
  bookAuthor: string;
  bookIsbn: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}