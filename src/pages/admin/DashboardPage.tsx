import React, { useEffect, useState } from 'react';
import { StatCard } from '../../components/admin/StatCard';
import { adminService } from '../../services/adminService';
import type { DashboardStats } from '../../services/adminService';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-slate-600 font-medium">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-red-600 text-lg font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Professional Icons cho StatCards
  const BookIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );

  const CategoryIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );

  const OrdersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const RevenueIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );

  const PendingIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CompletedIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const WarningIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header với welcome message */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
          <p className="text-blue-100 text-lg">
            Hôm nay bạn có {stats.pendingOrders} đơn hàng cần xử lý và {stats.lowStockBooks} sản phẩm sắp hết hàng.
          </p>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-8 -right-8 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
      </div>

      {/* Key Metrics - 4 cards trong 1 hàng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số sách"
          value={stats.totalBooks}
          icon={<BookIcon />}
          variant="primary"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatCard
          title="Danh mục"
          value={stats.totalCategories}
          icon={<CategoryIcon />}
          variant="info"
          trend={{ value: "+5%", isPositive: true }}
        />
        <StatCard
          title="Người dùng"
          value={stats.totalUsers}
          icon={<UsersIcon />}
          variant="success"
          trend={{ value: "+8%", isPositive: true }}
        />
        <StatCard
          title="Đơn hàng"
          value={stats.totalOrders}
          icon={<OrdersIcon />}
          variant="warning"
          trend={{ value: "+15%", isPositive: true }}
        />
      </div>

      {/* Revenue & Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu"
          value={`${stats.totalRevenue.toLocaleString('vi-VN')} VND`}
          icon={<RevenueIcon />}
          variant="success"
          trend={{ value: "+22%", isPositive: true }}
        />
        <StatCard
          title="Đơn hàng chờ"
          value={stats.pendingOrders}
          icon={<PendingIcon />}
          variant="warning"
        />
        <StatCard
          title="Đã hoàn thành"
          value={stats.completedOrders}
          icon={<CompletedIcon />}
          variant="success"
        />
        <StatCard
          title="Sách sắp hết"
          value={stats.lowStockBooks}
          icon={<WarningIcon />}
          variant="danger"
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Category Performance Chart */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-elegant p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Thống kê theo danh mục
            </h3>
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Doanh thu</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.categoryStats.map((category, index) => (
              <div key={index} className="group p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-emerald-500' :
                      index === 2 ? 'bg-purple-500' :
                      index === 3 ? 'bg-amber-500' :
                      'bg-slate-400'
                    }`}></div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                        {category.categoryName}
                      </p>
                      <p className="text-sm text-slate-500">{category.bookCount} sách</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">
                      {category.totalRevenue.toLocaleString('vi-VN')} VND
                    </p>
                    <div className="w-24 bg-slate-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-emerald-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-amber-500' :
                          'bg-slate-400'
                        }`}
                        style={{
                          width: `${Math.min((category.totalRevenue / Math.max(...stats.categoryStats.map(c => c.totalRevenue))) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-elegant p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Đơn hàng gần đây
            </h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors">
              <span>Xem tất cả</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.recentOrders.map((order, index) => (
              <div key={index} className="group p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      #{order.orderId.toString().slice(-2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">#{order.orderId}</p>
                      <p className="text-sm text-slate-600">{order.customerName}</p>
                      <p className="text-xs text-slate-400">{order.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 mb-2">
                      {order.amount.toLocaleString('vi-VN')} VND
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {order.status === 'DELIVERED' && '✅ '}
                      {order.status === 'PENDING' && '⏳ '}
                      {order.status === 'CONFIRMED' && '📋 '}
                      {order.status === 'CANCELLED' && '❌ '}
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;