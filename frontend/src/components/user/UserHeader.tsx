import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Store } from "lucide-react";
import { StorefrontUserMenu } from "./StorefrontUserMenu";
import { StorefrontMegaMenu } from "./StorefrontMegaMenu";
import Container from "../common/Container";
import { Logo } from "../common/Logo";

export const UserHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Sách Mới", href: "/books?sort=new" },
    { name: "Bán Chạy", href: "/books?sort=bestseller" },
    { name: "Văn Học", href: "/books?category=van-hoc" },
    { name: "Kỹ Năng Sống", href: "/books?category=ky-nang" },
    { name: "Thiếu Nhi", href: "/books?category=thieu-nhi" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <Container className="max-w-7xl px-2 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-8">
              <Logo />

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <StorefrontMegaMenu />
              </nav>

              {/* Register as Seller - Desktop */}
              <Link
                to="/register-shop"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors whitespace-nowrap"
              >
                <Store className="w-3.5 h-3.5" />
                Đăng ký Người Bán
              </Link>
            </div>

            {/* Search, Actions & Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Bar (Hidden on small mobile) */}
              <div className="hidden sm:flex relative items-center">
                <input
                  type="text"
                  placeholder="Tìm kiếm sách..."
                  className="w-48 lg:w-64 pl-10 pr-4 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-950 border focus:border-blue-500 rounded-full outline-none transition-all dark:text-white"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-muted font-bold flex items-center justify-center rounded-full">
                  3
                </span>
              </Link>

              {/* User Profile Menu */}
              <StorefrontUserMenu />

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Offcanvas Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Offcanvas Drawer */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-white dark:bg-zinc-950 z-70 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="font-bold text-lg text-zinc-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-blue-500 rounded-xl outline-none dark:text-white"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
          </div>

          <nav className="flex flex-col space-y-1">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-2">
              Danh mục
            </h3>
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.href}
                className="px-3 py-2.5 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Register as Seller - Mobile */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <Link
              to="/register-shop"
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Store className="w-4 h-4" />
              Đăng ký thành Người Bán
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
