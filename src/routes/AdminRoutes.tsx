import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../pages/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import BookManagementPage from '../pages/admin/BookManagementPage';
import CategoryManagementPage from '../pages/admin/CategoryManagementPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import OrderManagementPage from '../pages/admin/OrderManagementPage';

const AdminRoutes: React.FC = () => {
  console.log('📍 AdminRoutes rendering');
  
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Routes>
        <Route element={<AdminLayout />}>
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="books" element={<BookManagementPage />} />
          <Route path="categories" element={<CategoryManagementPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
};

export default AdminRoutes;