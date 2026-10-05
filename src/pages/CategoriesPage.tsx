import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { bookService } from '../services/bookService';
import type { Category, Book } from '../types';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';
import { BookOpen, ArrowRight } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryBooks, setCategoryBooks] = useState<Record<number, Book[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCategories, allBooks] = await Promise.all([
          categoryService.getCategories(),
          bookService.getBooks()
        ]);
        
        setCategories(fetchedCategories);
        
        // Group books by category
        const booksByCategory: Record<number, Book[]> = {};
        fetchedCategories.forEach(category => {
          booksByCategory[category.id] = allBooks.filter(book => book.categoryId === category.id).slice(0, 4);
        });
        setCategoryBooks(booksByCategory);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Danh Mục Sách</h1>
        <p className="text-gray-600">Khám phá sách theo từng danh mục chuyên biệt</p>
      </div>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
              <Link 
                to={`/books?category=${category.id}`}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {categoryBooks[category.id] && categoryBooks[category.id].length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryBooks[category.id].map((book) => (
                  <Card key={book.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                    <img 
                      src={book.imageUrl || 'https://via.placeholder.com/150'} 
                      alt={book.title} 
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-md font-semibold mb-2 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                      <div className="mt-auto">
                        <p className="text-lg font-bold text-blue-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chưa có sách trong danh mục này</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có danh mục nào được tạo.</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;