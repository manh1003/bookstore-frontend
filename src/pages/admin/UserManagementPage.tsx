import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { User } from '../../types';
import DataTable from '../../components/admin/DataTable';
import { Button } from '../../components/ui/Button';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách người dùng.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      await adminService.activateUser(user.id);
      await fetchUsers(); // Refresh data
    } catch (err) {
      setError('Không thể kích hoạt người dùng.');
      console.error(err);
    }
  };

  const handleDeactivateUser = async (user: User) => {
    if (window.confirm(`Bạn có chắc chắn muốn vô hiệu hóa tài khoản "${user.email}"?`)) {
      try {
        await adminService.deactivateUser(user.id);
        await fetchUsers(); // Refresh data
      } catch (err) {
        setError('Không thể vô hiệu hóa người dùng.');
        console.error(err);
      }
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA vĩnh viễn tài khoản "${user.email}"? Hành động này KHÔNG THỂ hoàn tác!`)) {
      try {
        await adminService.deleteUser(user.id);
        setUsers(users.filter(u => u.id !== user.id));
      } catch (err) {
        setError('Không thể xóa người dùng.');
        console.error(err);
      }
    }
  };

  const columns = [
    { 
      header: 'Tên', 
      accessor: (item: User) => `${item.firstName} ${item.lastName}` 
    },
    { 
      header: 'Email', 
      accessor: 'email' as keyof User 
    },
    { 
      header: 'Vai trò', 
      accessor: 'role' as keyof User 
    },
    { 
      header: 'Trạng thái', 
      accessor: (item: User) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
        </span>
      )
    },
    { 
      header: 'Email đã xác thực', 
      accessor: (item: User) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.emailVerified 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {item.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
        </span>
      )
    },
    {
      header: 'Hành động',
      accessor: (item: User) => (
        <div className="flex space-x-2">
          {item.isActive ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleDeactivateUser(item)}
            >
              Vô hiệu hóa
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleActivateUser(item)}
            >
              Kích hoạt
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDeleteUser(item)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Xóa
          </Button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải danh sách người dùng...</div>
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
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <div className="text-sm text-gray-500">
          Tổng số: {users.length} người dùng
        </div>
      </div>
      
      <DataTable<User>
        columns={columns}
        data={users}
        // Remove onEdit and onDelete since we handle actions inline
      />
    </div>
  );
};

export default UserManagementPage;