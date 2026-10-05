import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import type { Book } from '../../types';
import DataTable from '../../components/admin/DataTable';
import { Button } from '../../components/ui/Button';
import BookForm from '../../components/admin/BookForm';

const BookManagementPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await adminService.getBooks();
        setBooks(response);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (book: Book) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
      try {
        await adminService.deleteBook(book.id);
        setBooks(books.filter((b) => b.id !== book.id));
      } catch (err) {
        setError('Không thể xóa sách.');
      }
    }
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (updatedBook: Book) => {
    if (editingBook) {
      // Update existing book
      setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    } else {
      // Add new book
      setBooks([...books, updatedBook]);
    }
    setIsFormOpen(false);
    setEditingBook(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBook(null);
  };

  const columns = [
    {
      header: 'Tiêu đề',
      accessor: (item: Book) => (
        <div className="max-w-sm" title={item.title}>
          <div className="truncate font-medium text-gray-900">{item.title}</div>
        </div>
      )
    },
    {
      header: 'Tác giả',
      accessor: (item: Book) => (
        <div className="max-w-xs" title={item.author}>
          <div className="truncate text-gray-700">{item.author}</div>
        </div>
      )
    },
    {
      header: 'Giá',
      accessor: (item: Book) => (
        <span className="font-semibold text-green-600">
          {item.price.toLocaleString('vi-VN')} VND
        </span>
      )
    },
    {
      header: 'Tồn kho',
      accessor: (item: Book) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          item.stockQuantity > 10
            ? 'bg-green-100 text-green-800'
            : item.stockQuantity > 0
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {item.stockQuantity}
        </span>
      )
    },
    {
      header: 'Danh mục',
      accessor: (item: Book) => (
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {item.categoryName}
        </span>
      )
    },
  ];

  if (loading) return <div>Đang tải danh sách sách...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý sách</h1>
        <Button onClick={handleAddNew}>
          Thêm sách mới
        </Button>
      </div>
      <DataTable<Book>
        columns={columns}
        data={books}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <BookForm
        book={editingBook}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default BookManagementPage;