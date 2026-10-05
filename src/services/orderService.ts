import { apiClient } from './api';

// Interface dựa trên backend DTOs
export interface CreateOrderRequest {
  shippingAddress: string;
  phoneNumber: string;  // REQUIRED - consistent với backend
  note?: string;
}

export interface OrderResponse {
  id: number;
  status: string;
  totalAmount: number;
  currency: string;
  shippingAddress: string;
  phoneNumber?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  orderItems: OrderItemResponse[];
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface OrderItemResponse {
  id: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartItem {
  book: {
    id: number;
    title: string;
    author: string;
    price: number;
  };
  quantity: number;
}

export const orderService = {
  // Tạo order mới (empty order)
  createOrder: async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
    console.log('📦 Creating order:', orderData);
    return await apiClient.post<OrderResponse>('/orders', orderData);
  },

  // Thêm sách vào order
  addBookToOrder: async (orderId: number, bookId: number, quantity: number): Promise<OrderResponse> => {
    console.log(`📚 Adding book ${bookId} (qty: ${quantity}) to order ${orderId}`);
    return await apiClient.post<OrderResponse>(`/orders/${orderId}/items?bookId=${bookId}&quantity=${quantity}`);
  },

  // Lấy thông tin order
  getOrder: async (orderId: number): Promise<OrderResponse> => {
    return await apiClient.get<OrderResponse>(`/orders/${orderId}`);
  },

  // Lấy orders của user hiện tại
  getMyOrders: async (): Promise<OrderResponse[]> => {
    return await apiClient.get<OrderResponse[]>('/orders/my-orders');
  },

  // Hủy order
  cancelOrder: async (orderId: number): Promise<OrderResponse> => {
    console.log(`❌ Cancelling order ${orderId}`);
    return await apiClient.put<OrderResponse>(`/orders/${orderId}/cancel`);
  },

  // Xác nhận order với improved error handling
  confirmOrder: async (orderId: number): Promise<OrderResponse> => {
    console.log(`✅ Confirming order ${orderId}`);
    try {
      return await apiClient.put<OrderResponse>(`/orders/${orderId}/confirm`);
    } catch (error: any) {
      // Nếu lỗi 500 nhưng có khả năng order đã được confirm thành công
      if (error.status === 500) {
        console.log('⚠️ Server error during confirm, checking order status...');
        try {
          // Thử lấy lại order để xem status
          const order = await orderService.getOrder(orderId);
          if (order.status === 'CONFIRMED') {
            console.log('✅ Order was actually confirmed successfully despite server error');
            return order;
          }
        } catch (fetchError) {
          console.log('❌ Could not verify order status after confirm error');
        }
      }
      throw error;
    }
  },

  // Helper function: Tạo order hoàn chỉnh với items - IMPROVED ERROR HANDLING
  createCompleteOrder: async (
    orderData: CreateOrderRequest,
    cartItems: CartItem[]
  ): Promise<OrderResponse> => {
    let orderId: number | null = null;
    
    try {
      // Step 1: Tạo empty order
      console.log('🚀 Starting complete order creation...');
      let order = await orderService.createOrder(orderData);
      orderId = order.id;
      
      // Step 2: Add từng item vào order
      for (const item of cartItems) {
        console.log(`Adding ${item.book.title} x${item.quantity} to order ${order.id}`);
        order = await orderService.addBookToOrder(order.id, item.book.id, item.quantity);
      }
      
      // Step 3: Confirm order với improved error handling
      console.log(`Order ${order.id} created with ${cartItems.length} items, confirming...`);
      const confirmedOrder = await orderService.confirmOrder(order.id);
      
      console.log('✅ Order created successfully:', confirmedOrder);
      return confirmedOrder;
      
    } catch (error: any) {
      console.error('❌ Error creating complete order:', error);
      
      // Nếu có orderId và lỗi ở bước confirm, thử kiểm tra lại status
      if (orderId && error.status === 500) {
        console.log('⚠️ Checking if order was actually completed despite error...');
        try {
          const finalOrder = await orderService.getOrder(orderId);
          if (finalOrder.status === 'CONFIRMED' && finalOrder.orderItems.length > 0) {
            console.log('✅ Order was actually completed successfully!');
            return finalOrder;
          }
        } catch (fetchError) {
          console.log('❌ Could not verify final order status');
        }
      }
      
      throw error;
    }
  }
};