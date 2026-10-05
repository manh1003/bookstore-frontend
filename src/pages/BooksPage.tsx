import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import type { Book, Category, PageResponse } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Pagination from '../components/ui/Pagination';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { Search, Filter, Package, Star, ShoppingCart, Eye } from 'lucide-react';

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const addItemToCart = useCartStore((state) => state.addItem);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await categoryService.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error('Không thể tải danh mục.');
      }
    };

    fetchCategories();
  }, []);

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page - 1, // API uses 0-based indexing
        size: itemsPerPage,
        activeOnly: true,
        ...(selectedCategory !== 'all' && { categoryId: parseInt(selectedCategory) }),
        ...(searchTerm && { search: searchTerm })
      };
      
      const response: PageResponse<Book> = await bookService.getBooksPaginated(params);
      setBooks(response.content);
      setCurrentPage(page);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalElements);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error('Không thể tải dữ liệu sách.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, [selectedCategory, searchTerm]);

  // Handle URL search params for category
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.length > 0) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams, categories]);

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  const handleAddToCart = (book: Book) => {
    addItemToCart(book);
    toast.success(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };

  const getCurrentCategoryName = () => {
    if (selectedCategory === 'all') return 'tất cả danh mục';
    const category = categories.find(c => c.id.toString() === selectedCategory);
    return category ? `danh mục "${category.name}"` : 'danh mục không xác định';
  };

  if (loading) {
    return <div className="text-center mt-8">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-4">Khám phá thế giới sách</h1>
            <p className="text-xl text-blue-100 mb-8">Hàng nghìn cuốn sách đang chờ bạn khám phá</p>
            
            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="flex bg-white rounded-full shadow-2xl overflow-hidden">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sách theo tên, tác giả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-700 bg-transparent focus:outline-none text-lg"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-4 text-gray-700 bg-transparent focus:outline-none appearance-none border-l border-gray-200 min-w-[200px]"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sản phẩm</h2>
            <p className="text-gray-600">
              Hiển thị <span className="font-semibold text-blue-600">{books.length}</span> sách trong tổng số <span className="font-semibold text-blue-600">{totalItems}</span>
              {selectedCategory !== 'all' && (
                <span> trong <span className="font-medium">{getCurrentCategoryName()}</span></span>
              )}
              {searchTerm && (
                <span> cho từ khóa "<span className="font-semibold text-purple-600">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{books.filter(b => b.stockQuantity > 0).length}</div>
              <div className="text-sm text-gray-500">Còn hàng</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-500">Danh mục</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{books.length}</div>
              <div className="text-sm text-gray-500">Tổng sách</div>
            </div>
          </div>
        </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="group relative flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50">
            {/* Image Container with Overlay */}
            <div className="relative overflow-hidden">
              <img
                src={book.imageUrl || 'https://via.placeholder.com/250x350?text=No+Image'}
                alt={book.title}
                className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Stock Badge */}
              <div className="absolute top-3 left-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  book.stockQuantity > 10
                    ? 'bg-green-100 text-green-800'
                    : book.stockQuantity > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <Package className="w-3 h-3" />
                  {book.stockQuantity > 0 ? `${book.stockQuantity} sẵn có` : 'Hết hàng'}
                </span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button className="p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Category Badge */}
              <span className="inline-block w-fit px-2 py-1 mb-2 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {book.categoryName}
              </span>

              {/* Title */}
              <h2 className="text-lg font-bold mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                {book.title}
              </h2>
              
              {/* Author */}
              <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                {book.author}
              </p>
              
              {/* Description */}
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow leading-relaxed">
                {book.description || 'Mô tả sách sẽ được cập nhật sớm...'}
              </p>

              {/* Rating Placeholder */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-500 ml-1">(4.0)</span>
              </div>

              {/* Price and Actions */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xl font-bold text-green-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                    </p>
                    <p className="text-xs text-gray-500 line-through">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price * 1.2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Tiết kiệm</p>
                    <p className="text-sm font-semibold text-red-500">20%</p>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(book)}
                  disabled={book.stockQuantity === 0}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {book.stockQuantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                </Button>
              </div>
            </div>

            {/* Sale Badge */}
            <div className="absolute top-3 right-3">
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full shadow-lg">
                -20%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Không tìm thấy sách nào phù hợp với tiêu chí tìm kiếm.
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
      </div>
    </div>
  );
};

export default BooksPage;