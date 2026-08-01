import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import Container from "../common/Container";
import { Logo } from "../common/Logo";

export const UserFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 pt-12 pb-8">
      <Container className="max-w-7xl px-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Khơi nguồn tri thức, bừng sáng tương lai. Nền tảng mua sắm sách trực tuyến hàng đầu với hàng ngàn đầu sách chất lượng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-pink-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Danh mục sách</h3>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/books?category=van-hoc" className="hover:text-blue-600 dark:hover:text-blue-400">Văn học</Link></li>
              <li><Link to="/books?category=kinh-te" className="hover:text-blue-600 dark:hover:text-blue-400">Kinh tế</Link></li>
              <li><Link to="/books?category=tam-ly" className="hover:text-blue-600 dark:hover:text-blue-400">Tâm lý - Kỹ năng</Link></li>
              <li><Link to="/books?category=thieu-nhi" className="hover:text-blue-600 dark:hover:text-blue-400">Thiếu nhi</Link></li>
              <li><Link to="/books?category=ngoai-ngu" className="hover:text-blue-600 dark:hover:text-blue-400">Ngoại ngữ</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Chính sách đổi trả</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Chính sách bảo mật</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Hướng dẫn mua hàng</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Phương thức thanh toán</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>123 Đường Sách, Phường Đọc, Quận Trí Tuệ, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0" />
                <span>1900 1234 (8:00 - 22:00)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0" />
                <span>support@bookshop.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} BookShop. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4 items-center">
            <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">VNPay</span>
            <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">Momo</span>
            <span className="text-xs font-semibold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">Visa / Mastercard</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
