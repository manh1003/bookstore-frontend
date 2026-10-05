import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, X, ShoppingBag, Calendar, CreditCard, AlertTriangle, Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import type { Order } from '../types';
import type { OrderResponse } from '../services/orderService';

interface UserProfile {
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

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersData = await orderService.getMyOrders();
      setOrders(ordersData);
      setOrderError(null);
    } catch (err: any) {
      setOrderError('Không thể tải lịch sử đơn hàng');
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await orderService.cancelOrder(orderId);
        // Refresh orders list
        await loadOrders();
      } catch (err: any) {
        setOrderError('Không thể hủy đơn hàng');
        console.error(err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PROCESSING': return 'Đang xử lý';
      case 'SHIPPED': return 'Đã giao';
      case 'DELIVERED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setEditForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || ''
      });
    } catch (err: any) {
      setError('Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || ''
      });
    }
    setError(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      console.log('🔄 Bắt đầu cập nhật profile:', editForm);
      
      const updatedProfile = await userService.updateProfile(editForm);
      console.log('✅ Backend response:', updatedProfile);
      
      setProfile(updatedProfile);
      
      // Convert to User type để tránh type mismatch
      const userUpdate = {
        ...updatedProfile,
        role: updatedProfile.role as 'CUSTOMER' | 'ADMIN',
        phoneNumber: updatedProfile.phoneNumber || undefined,
        lastLogin: updatedProfile.lastLogin || undefined
      };
      
      console.log('👤 Updating auth store with:', userUpdate);
      updateUser(userUpdate);
      
      setIsEditing(false);
      console.log('✅ Hoàn thành cập nhật!');
      
    } catch (err: any) {
      console.error('❌ Lỗi cập nhật:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
      
      setError(
        err.response?.data?.message ||
        err.message ||
        'Không thể cập nhật thông tin'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-red-600">Không thể tải thông tin profile</p>
            <Button onClick={loadProfile} className="mt-4">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6" />
              Thông tin cá nhân
            </h1>
            {!isEditing && (
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Profile Information */}
            <div>
              <Card className="p-6">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin cơ bản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Nhập tên"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Nhập họ"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{profile.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {profile.emailVerified ? '✓ Đã xác thực' : '⚠ Chưa xác thực'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vai trò
                    </label>
                    <p className="text-gray-900">
                      {profile.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin liên lạc
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phoneNumber || 'Chưa cập nhật'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <Input
                        value={editForm.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.address || 'Chưa cập nhật'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Trạng thái tài khoản
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <p className={`${profile.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {profile.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lần đăng nhập cuối
                    </label>
                    <p className="text-gray-900">{formatDate(profile.lastLogin)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày tạo tài khoản
                    </label>
                    <p className="text-gray-900">{formatDate(profile.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              )}
                </div>
              </Card>
            </div>

            {/* Right Column - Order History */}
            <div>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Lịch sử mua hàng
                  </h3>
                  <Button variant="outline" onClick={() => loadOrders()} size="sm">
                    Làm mới
                  </Button>
                </div>

                {orderError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {orderError}
                  </div>
                )}

                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Đang tải lịch sử đơn hàng...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Bạn chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-screen overflow-y-auto">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-blue-600">#{order.id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                {order.totalAmount.toLocaleString('vi-VN')} VND
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {order.status === 'CONFIRMED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelOrder(order.id)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <AlertTriangle className="w-4 h-4" />
                                Hủy đơn
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.orderItems && order.orderItems.length > 0 && (
                          <div className="border-t pt-3 mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Chi tiết đơn hàng:</h4>
                            <div className="space-y-2">
                              {order.orderItems.slice(0, 3).map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 truncate" title={item.bookTitle}>
                                      {item.bookTitle}
                                    </div>
                                    <div className="text-gray-600">
                                      {item.bookAuthor} • SL: {item.quantity}
                                    </div>
                                  </div>
                                  <div className="text-right font-medium text-green-600">
                                    {item.subtotal.toLocaleString('vi-VN')} VND
                                  </div>
                                </div>
                              ))}
                              {order.orderItems.length > 3 && (
                                <div className="text-sm text-blue-600 font-medium">
                                  +{order.orderItems.length - 3} sản phẩm khác
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className="border-t pt-3 mt-3">
                            <div className="text-sm text-gray-600">
                              <strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}
                            </div>
                            {order.phoneNumber && (
                              <div className="text-sm text-gray-600">
                                <strong>SĐT:</strong> {order.phoneNumber}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
