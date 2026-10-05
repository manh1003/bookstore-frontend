import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { Category, CreateCategoryRequest } from '../../types';
import DataTable from '../../components/admin/DataTable';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { Button } from '../../components/ui/Button';

type ViewMode = 'list' | 'add' | 'edit';

const CategoryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      console.log('📂 Fetching categories...');
      const response = await adminService.getCategories();
      console.log('📂 Categories response:', response);
      setCategories(response);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError('Không thể tải danh sách danh mục.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (data: CreateCategoryRequest) => {
    try {
      setFormLoading(true);
      await adminService.createCategory(data);
      await fetchCategories();
      setViewMode('list');
      setError(null);
    } catch (err) {
      setError('Không thể thêm danh mục.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCategory = async (data: CreateCategoryRequest) => {
    if (!selectedCategory) return;
    
    try {
      setFormLoading(true);
      await adminService.updateCategory(selectedCategory.id, data);
      await fetchCategories();
      setViewMode('list');
      setSelectedCategory(null);
      setError(null);
    } catch (err) {
      setError('Không thể cập nhật danh mục.');
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setViewMode('edit');
  };

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      try {
        await adminService.deleteCategory(category.id);
        setCategories(categories.filter((c) => c.id !== category.id));
      } catch (err) {
        setError('Không thể xóa danh mục.');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedCategory(null);
    setError(null);
  };

  const columns = [
    { 
      header: 'Tên', 
      accessor: 'name' as keyof Category 
    },
    { 
      header: 'Mô tả', 
      accessor: 'description' as keyof Category 
    },
    { 
      header: 'Trạng thái', 
      accessor: (item: Category) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
        </span>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Đang tải danh sách danh mục...</div>
      </div>
    );
  }

  if (error && viewMode === 'list') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (viewMode === 'add') {
    return (
      <div>
        <CategoryForm
          onSubmit={handleAddCategory}
          onCancel={handleCancel}
          loading={formLoading}
        />
        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
      </div>
    );
  }

  if (viewMode === 'edit' && selectedCategory) {
    return (
      <div>
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleEditCategory}
          onCancel={handleCancel}
          loading={formLoading}
        />
        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Tổng số: {categories.length} danh mục
          </div>
          <Button onClick={() => setViewMode('add')}>
            Thêm danh mục mới
          </Button>
        </div>
      </div>
      
      <DataTable<Category>
        columns={columns}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CategoryManagementPage;