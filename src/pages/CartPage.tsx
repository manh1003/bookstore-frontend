import React from 'react';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { items, totalAmount, totalItems, updateQuantity, removeItem, clearCart } = useCartStore();

  const handleQuantityChange = (bookId: number, quantity: string) => {
    const numQuantity = parseInt(quantity, 10);
    if (!isNaN(numQuantity) && numQuantity > 0) {
      updateQuantity(bookId, numQuantity);
    }
  };

  const handleRemoveItem = (bookId: number, bookTitle: string) => {
    removeItem(bookId);
    toast.success(`Đã xóa "${bookTitle}" khỏi giỏ hàng.`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h1>
        <p className="text-lg text-gray-600">Giỏ hàng của bạn đang trống.</p>
        <Link to="/">
          <Button className="mt-6">Tiếp tục mua sắm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map(({ book, quantity }) => (
              <div key={book.id} className="flex items-center bg-white p-4 rounded-lg shadow">
                <img src={book.imageUrl || 'https://via.placeholder.com/100'} alt={book.title} className="w-24 h-32 object-cover rounded-md mr-6" />
                <div className="flex-grow">
                  <h2 className="text-lg font-bold">{book.title}</h2>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-lg font-semibold text-blue-600 mt-1">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(book.id, e.target.value)}
                    className="w-20 text-center"
                  />
                  <Button variant="destructive" onClick={() => handleRemoveItem(book.id, book.title)}>
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Tổng sản phẩm ({totalItems})</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
              </span>
            </div>
            <div className="flex justify-between mb-6">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-semibold">Miễn phí</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-xl mb-6">
              <span>Tổng cộng</span>
              <span>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
              </span>
            </div>
            <Link to="/checkout">
              <Button className="w-full">
                Tiến hành thanh toán
              </Button>
            </Link>
            <Button variant="secondary" className="w-full mt-4" onClick={clearCart}>
              Xóa giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;