import React from "react";
import { Link } from "react-router-dom";
import { Search, Mic, Image as ImageIcon, ShoppingCart } from "lucide-react";

import { Logo } from "../common/Logo";
import { SidebarToggle } from "./SidebarToggle";
import { AccountMenu } from "./AccountMenu";
import Container from "../common/Container";
import { StorefrontMegaMenu } from "./StorefrontMegaMenu";

export const UserHeader: React.FC = () => {
  return (
    <nav className="fixed top-0 z-50 w-full h-17 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <Container className="max-w-7xl flex h-full items-center justify-between px-2">
        <div className="flex items-center justify-start rtl:justify-end">
          <SidebarToggle />
          <Logo href="/home" />
        </div>
        <div className="hidden lg:block flex-1 px-8">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-6">
              <StorefrontMegaMenu />
              <Link to="/register-shop" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Trở thành Nhà bán hàng
              </Link>
            </div>
            <div className="flex-1 max-w-md ml-8">
              <div className="relative flex items-center w-full h-10 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="pl-3 text-zinc-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sách, tác giả..."
                  className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm px-3 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                />
                <div className="flex items-center pr-2 gap-1">
                  <button type="button" className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors" title="Tìm kiếm bằng giọng nói">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors" title="Tìm kiếm bằng hình ảnh">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative p-2 text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border border-white dark:border-zinc-900 transform translate-x-1 -translate-y-1">
              3
            </span>
          </Link>
          <AccountMenu />
        </div>
      </Container>
    </nav>
  );
};
