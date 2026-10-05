import { type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { authService } from '../../services/authService';

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    clearAuth();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">BookStore</span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/books" className="text-gray-700 hover:text-primary-600 transition-colors">
              Sách
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              Danh mục
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                Quản trị
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{user?.firstName}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Đăng nhập
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Trang chủ
              </Link>
              <Link to="/books" className="text-gray-700 hover:text-primary-600 transition-colors">
                Sách
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                Danh mục
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Quản trị
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {children}
    </header>
  );
};

export { Header };