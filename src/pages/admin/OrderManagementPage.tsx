import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { Order } from '../../types';
import DataTable from '../../components/admin/DataTable';
import { Button } from '../../components/ui/Button';

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOrders();
      setOrders(response);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (order: Order, newStatus: string) => {
    try {
      const updatedOrder = await adminService.updateOrderStatus(order.id, newStatus);
      setOrders(orders.map((o) => (o.id === order.id ? updatedOrder : o)));
      setError(null);
    } catch (err) {
      setError('Không thể cập nhật trạng thái đơn hàng.');
      console.error(err);
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

  const columns = [
    {
      header: 'Mã đơn hàng',
      accessor: (item: Order) => (
        <div>
          <div className="font-semibold text-blue-600">#{item.id}</div>
          <div className="text-xs text-gray-500">
            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      )
    },
    {
      header: 'Khách hàng',
      accessor: (item: Order) => (
        <div>
          <div className="font-medium">
            {item.user ? `${item.user.firstName} ${item.user.lastName}` : 'N/A'}
          </div>
          {item.user && (
            <div className="text-xs text-gray-500">{item.user.email}</div>
          )}
        </div>
      )
    },
    {
      header: 'Chi tiết đơn hàng',
      accessor: (item: Order) => (
        <div className="max-w-md">
          <div className="space-y-1">
            {item.orderItems && item.orderItems.length > 0 ? (
              item.orderItems.slice(0, 2).map((orderItem, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium truncate" title={orderItem.bookTitle}>
                    {orderItem.bookTitle}
                  </div>
                  <div className="text-xs text-gray-600">
                    SL: {orderItem.quantity} × {orderItem.unitPrice.toLocaleString('vi-VN')} VND
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Không có sản phẩm</div>
            )}
            {item.orderItems && item.orderItems.length > 2 && (
              <div className="text-xs text-blue-600 font-medium">
                +{item.orderItems.length - 2} sách khác
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Tổng tiền',
      accessor: (item: Order) => (
        <div className="text-right">
          <div className="font-semibold text-green-600">
            {item.totalAmount.toLocaleString('vi-VN')} VND
          </div>
          {item.orderItems && (
            <div className="text-xs text-gray-500">
              ({item.orderItems.length} sản phẩm)
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Trạng thái',
      accessor: (item: Order) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
          {getStatusLabel(item.status)}
        </span>
      )
    },
    {
      header: 'Cập nhật trạng thái',
      accessor: (item: Order) => (
        <select
          value={item.status}
          onChange={(e) => handleStatusChange(item, e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={item.status === 'DELIVERED' || item.status === 'CANCELLED'}
        >
          <option value="PENDING">Chờ xử lý</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="SHIPPED">Đã giao</option>
          <option value="DELIVERED">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải danh sách đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Tổng số: {orders.length} đơn hàng
          </div>
          <Button onClick={fetchOrders} variant="secondary">
            Làm mới
          </Button>
        </div>
      </div>
      
      <DataTable<Order>
        columns={columns}
        data={orders}
        // No direct edit/delete, actions are inline
      />
    </div>
  );
};

export default OrderManagementPage;