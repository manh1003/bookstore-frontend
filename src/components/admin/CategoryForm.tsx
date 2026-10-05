import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import type { Category, CreateCategoryRequest } from '../../types';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CreateCategoryRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên danh mục *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập tên danh mục"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Nhập mô tả danh mục"
            rows={3}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : (category ? 'Cập nhật' : 'Thêm mới')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
};