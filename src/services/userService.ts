import { apiClient } from './api';

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface UserProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export const userService = {
  // Lấy thông tin profile của user hiện tại
  getProfile: async (): Promise<UserProfile> => {
    return await apiClient.get<UserProfile>('/user/profile');
  },

  // Cập nhật thông tin profile
  updateProfile: async (updateData: UserProfileUpdateRequest): Promise<UserProfile> => {
    return await apiClient.put<UserProfile>('/user/profile', updateData);
  },

  // Lấy thông tin user theo ID (dành cho admin)
  getUserById: async (id: number): Promise<UserProfile> => {
    return await apiClient.get<UserProfile>(`/user/${id}`);
  },

  // Cập nhật trạng thái user (dành cho admin)
  updateUserStatus: async (id: number, isActive: boolean): Promise<UserProfile> => {
    return await apiClient.put<UserProfile>(`/user/${id}/status?isActive=${isActive}`);
  },

  // Xóa user (dành cho admin)
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/user/${id}`);
  },

  // Reset password user (dành cho admin)
  resetPassword: async (id: number): Promise<void> => {
    await apiClient.post(`/user/${id}/reset-password`);
  }
};