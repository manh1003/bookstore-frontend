import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold">BookStore</span>
            </div>
            <p className="text-gray-400 text-sm">
              Website thương mại điện tử bán sách
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a
                  href="/books"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Sách
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Danh mục
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Giới thiệu
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Giao hàng
                </a>
              </li>
              <li>
                <a
                  href="/return"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Đổi trả
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 support@bookstore.com</li>
              <li>📞 012345678</li>
              <li>📍 Hồ Chí Minh, Việt Nam</li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 BookStore. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="/privacy"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Chính sách bảo mật
            </a>
            <a
              href="/terms"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Điều khoản sử dụng
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
