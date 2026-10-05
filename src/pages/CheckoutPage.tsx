import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Phone, CreditCard, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { userService, type UserProfile } from '../services/userService';
import { orderService, type CreateOrderRequest } from '../services/orderService';
import toast from 'react-hot-toast';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  note?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalAmount, totalItems, clearCart } = useCartStore();
  const { user, updateUser } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileIncomplete, setProfileIncomplete] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Giỏ hàng trống');
      navigate('/cart');
      return;
    }

    loadUserProfile();
  }, [user, items.length, navigate]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading user profile for checkout...');
      const data = await userService.getProfile();
      console.log('✅ Profile loaded:', data);
      
      setProfile(data);
      
      // Kiểm tra thông tin bắt buộc cho thanh toán
      const isIncomplete = !data.phoneNumber || !data.address || !data.firstName || !data.lastName;
      setProfileIncomplete(isIncomplete);
      
      if (isIncomplete) {
        console.log('⚠️ Profile incomplete - missing required fields for checkout');
        toast.error('Vui lòng cập nhật đầy đủ thông tin cá nhân (SĐT, địa chỉ) trước khi thanh toán');
      } else {
        // Pre-fill shipping info từ profile
        setShippingInfo({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          note: ''
        });
      }
    } catch (err: any) {
      console.error('❌ Error loading profile:', err);
      toast.error('Không thể tải thông tin profile');
      setProfileIncomplete(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateShippingInfo = (): boolean => {
    if (!shippingInfo.firstName.trim()) {
      toast.error('Vui lòng nhập tên');
      return false;
    }
    if (!shippingInfo.lastName.trim()) {
      toast.error('Vui lòng nhập họ');
      return false;
    }
    if (!shippingInfo.phoneNumber.trim()) {
      toast.error('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!shippingInfo.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async () => {
    if (!validateShippingInfo()) return;

    try {
      setProcessing(true);
      console.log('🔄 Updating profile with shipping info...');
      const updatedProfile = await userService.updateProfile({
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        phoneNumber: shippingInfo.phoneNumber,
        address: shippingInfo.address
      });
      
      // Cập nhật auth store với profile mới (convert type)
      updateUser({
        ...updatedProfile,
        role: updatedProfile.role as "CUSTOMER" | "ADMIN",
        lastLogin: updatedProfile.lastLogin || undefined
      });
      
      // Cập nhật local state
      setProfile(updatedProfile);
      setProfileIncomplete(false);
      
      toast.success('Đã cập nhật thông tin thành công');
      console.log('✅ Profile updated successfully and synced to auth store');
    } catch (err: any) {
      console.error('❌ Error updating profile:', err);
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateShippingInfo()) return;

    if (profileIncomplete) {
      toast.error('Vui lòng cập nhật thông tin cá nhân trước khi đặt hàng');
      return;
    }

    try {
      setProcessing(true);
      console.log('🚀 Starting order creation process...');
      
      // Tạo order request theo backend format
      const orderRequest: CreateOrderRequest = {
        shippingAddress: shippingInfo.address,
        phoneNumber: shippingInfo.phoneNumber,
        note: shippingInfo.note || undefined
      };

      // Tạo order hoàn chỉnh với items từ cart
      const completedOrder = await orderService.createCompleteOrder(orderRequest, items);
      
      toast.success(`Đặt hàng thành công! Mã đơn hàng: #${completedOrder.id}`);
      console.log('✅ Order completed:', completedOrder);
      
      // Clear cart nhưng KHÔNG redirect ngay - để user thấy success message
      clearCart();
      
      // Delay redirect để user có thể thấy toast success
      setTimeout(() => {
        navigate('/', {
          state: { message: `Đơn hàng #${completedOrder.id} đã được tạo thành công!` }
        });
      }, 2000);
      
    } catch (err: any) {
      console.error('❌ Error creating order:', err);
      toast.error('Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="h-48 bg-gray-300 rounded"></div>
                  <div className="h-64 bg-gray-300 rounded"></div>
                </div>
                <div className="h-80 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Thanh toán
            </h1>
            <Button variant="outline" onClick={() => navigate('/cart')}>
              Quay lại giỏ hàng
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Shipping & Profile Info */}
            <div className="space-y-6">
              {/* Profile Status Warning */}
              {profileIncomplete && (
                <Card className="p-6 border-orange-200 bg-orange-50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-orange-800 mb-2">
                        Thông tin cá nhân chưa đầy đủ
                      </h3>
                      <p className="text-orange-700 text-sm mb-3">
                        Để có thể thanh toán, bạn cần có đầy đủ: tên, họ, số điện thoại và địa chỉ giao hàng
                      </p>
                      <Button
                        size="sm"
                        onClick={() => navigate('/profile')}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Cập nhật profile
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Shipping Information Form */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Thông tin giao hàng
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Nhập tên"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Nhập họ"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={shippingInfo.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="0901234567"
                      maxLength={20}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ giao hàng <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={shippingInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Nhập địa chỉ đầy đủ: số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      maxLength={255}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú cho đơn hàng (tùy chọn)
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      value={shippingInfo.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      placeholder="Ghi chú thêm cho người giao hàng..."
                      maxLength={500}
                    />
                  </div>

                  {profileIncomplete && (
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={processing}
                      className="w-full"
                      variant="outline"
                    >
                      {processing ? 'Đang cập nhật...' : 'Cập nhật thông tin cá nhân'}
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Đơn hàng của bạn ({totalItems} sản phẩm)
                </h3>
                
                <div className="space-y-4">
                  {items.map(({ book, quantity }) => (
                    <div key={book.id} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-b-0">
                      <img 
                        src={book.imageUrl || 'https://via.placeholder.com/60'} 
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium text-sm">{book.title}</h4>
                        <p className="text-xs text-gray-600">{book.author}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">x{quantity}</span>
                          <span className="font-semibold text-blue-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Payment Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tóm tắt thanh toán
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={processing || profileIncomplete}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                  </Button>
                  
                  {profileIncomplete && (
                    <p className="text-sm text-orange-600 text-center">
                      ⚠️ Vui lòng cập nhật đầy đủ thông tin cá nhân để có thể đặt hàng
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;