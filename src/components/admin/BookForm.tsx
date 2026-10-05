import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../ui/Button';
import type { Book, Category, CreateBookRequest } from '../../types';

interface BookFormProps {
  book?: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (book: Book) => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, isOpen, onClose, onSubmit }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author: '',
    isbn: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    categoryId: 0,
    imageUrl: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (book) {
        setFormData({
          title: book.title,
          author: book.author,
          isbn: book.isbn || '',
          description: book.description || '',
          price: book.price,
          stockQuantity: book.stockQuantity,
          categoryId: book.categoryId,
          imageUrl: book.imageUrl || '',
        });
      } else {
        setFormData({
          title: '',
          author: '',
          isbn: '',
          description: '',
          price: 0,
          stockQuantity: 0,
          categoryId: 0,
          imageUrl: '',
        });
      }
    }
  }, [isOpen, book]);

  const fetchCategories = async () => {
    try {
      const response = await adminService.getCategories();
      setCategories(response);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear any existing errors when user starts typing
    if (error) setError(null);
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' || name === 'categoryId' 
        ? (value === '' ? 0 : Number(value))
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.categoryId === 0) {
      setError('Vui lòng chọn danh mục');
      return;
    }
    
    if (formData.price <= 0) {
      setError('Giá phải lớn hơn 0');
      return;
    }
    
    if (formData.stockQuantity < 0) {
      setError('Số lượng tồn kho không được âm');
      return;
    }
    
    // Validate ISBN format
    if (book && book.isbn === formData.isbn) {
      // ISBN is not changed, so no need to validate
    } else {
      const isbnRegex = /^(978|979)[0-9]{10}$/;
      if (!isbnRegex.test(formData.isbn)) {
        setError('ISBN phải có định dạng 978XXXXXXXXXX hoặc 979XXXXXXXXXX (13 số)');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let updatedBook: Book;
      
      if (book) {
        // Update existing book
        updatedBook = await adminService.updateBook(book.id, formData);
      } else {
        // Create new book
        updatedBook = await adminService.createBook(formData);
      }
      
      onSubmit(updatedBook);
      onClose();
    } catch (err: any) {
      console.error('Error saving book:', err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      } else if (err.response?.status === 409) {
        setError('ISBN này đã tồn tại. Vui lòng sử dụng ISBN khác.');
      } else {
        setError('Có lỗi xảy ra khi lưu sách. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {book ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Tác giả *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* ISBN */}
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN * <span className="text-xs text-gray-500">(13 số: 978XXXXXXXXXX)</span>
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                required
                pattern="^(978|979)[0-9]{10}$"
                placeholder="9781234567890"
                maxLength={13}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Ví dụ: 9781234567890
              </div>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VND) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="1"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div className="md:col-span-2">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL hình ảnh
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={1000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : (book ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;