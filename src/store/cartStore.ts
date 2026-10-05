import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Book } from '../types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  
  addItem: (book: Book, quantity?: number) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (bookId: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      
      addItem: (book, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.book.id === book.id);
          
          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map(item =>
              item.book.id === book.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [...state.items, { book, quantity }];
          }
          
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = newItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
          
          return { items: newItems, totalItems, totalAmount };
        });
      },
      
      removeItem: (bookId) => {
        set((state) => {
          const newItems = state.items.filter(item => item.book.id !== bookId);
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = newItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
          
          return { items: newItems, totalItems, totalAmount };
        });
      },
      
      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        
        set((state) => {
          const newItems = state.items.map(item =>
            item.book.id === bookId
              ? { ...item, quantity }
              : item
          );
          
          const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const totalAmount = newItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
          
          return { items: newItems, totalItems, totalAmount };
        });
      },
      
      clearCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0 });
      },
      
      getItemQuantity: (bookId) => {
        const item = get().items.find(item => item.book.id === bookId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);