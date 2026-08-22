import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import Container from "../common/Container";
import { Logo } from "../common/Logo";

export const UserFooter: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-6">
      <Container className="max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 mb-4 line-clamp-2">
              Nền tảng mua sắm sách trực tuyến hàng đầu.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-pink-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Danh mục</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/books?category=van-hoc" className="hover:text-blue-600 dark:hover:text-blue-400">Văn học</Link></li>
              <li><Link to="/books?category=kinh-te" className="hover:text-blue-600 dark:hover:text-blue-400">Kinh tế</Link></li>
              <li><Link to="/books?category=thieu-nhi" className="hover:text-blue-600 dark:hover:text-blue-400">Thiếu nhi</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Đổi trả</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Bảo mật</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate">123 Đường Sách, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>1900 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>support@bookshop.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} BookShop.
            </p>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600">v1.0.0</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">VNPay</span>
            <span className="text-[10px] font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">Momo</span>
            <span className="text-[10px] font-medium px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">Visa / Mastercard</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
