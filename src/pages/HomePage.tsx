import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { categoryService } from '../services/categoryService';
import type { Book, Category } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const addItemToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allBooks, fetchedCategories] = await Promise.all([
          bookService.getBooks(),
          categoryService.getCategories()
        ]);

        // Featured books (first 4 books)
        setFeaturedBooks(allBooks.slice(0, 4));
        
        // New books (last 4 books, assuming newer books have higher IDs)
        setNewBooks(allBooks.slice(-4).reverse());
        
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('Không thể tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (book: Book) => {
    addItemToCart(book);
    toast.success(`Đã thêm "${book.title}" vào giỏ hàng!`);
  };

  if (loading) {
    return <div className="text-center mt-8">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Chào mừng đến với BookStore</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Khám phá thế giới tri thức bao la với hàng ngàn cuốn sách từ mọi thể loại. 
            Tìm kiếm cuốn sách hoàn hảo cho hành trình học tập của bạn.
          </p>
          <div className="space-x-4">
            <Link to="/books">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Khám phá ngay
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent">
                Danh mục sách
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Books Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-900">Sách Nổi Bật</h2>
            </div>
            <Link 
              to="/books" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Card key={book.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={book.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={book.title} 
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Nổi bật
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{book.author}</p>
                  <div className="mt-auto">
                    <p className="text-lg font-bold text-blue-600 mb-3">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(book)}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-900">Danh Mục Phổ Biến</h2>
            </div>
            <Link 
              to="/categories" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/books?category=${category.id}`}>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* New Books Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold text-gray-900">Sách Mới</h2>
            </div>
            <Link 
              to="/books" 
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newBooks.map((book) => (
              <Card key={book.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={book.imageUrl || 'https://via.placeholder.com/150'} 
                    alt={book.title} 
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Mới
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{book.author}</p>
                  <div className="mt-auto">
                    <p className="text-lg font-bold text-blue-600 mb-3">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(book)}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tìm không ra cuốn sách bạn cần?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Hãy khám phá bộ sưu tập đầy đủ của chúng tôi với hàng nghìn cuốn sách từ mọi thể loại, 
            từ khoa học công nghệ đến văn học nghệ thuật.
          </p>
          <Link to="/books">
            <Button size="lg">
              Xem tất cả sách
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;