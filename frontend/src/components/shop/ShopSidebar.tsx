import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  PieChart,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  Archive,
  Menu,
} from "lucide-react";

export const ShopSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-shop-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-shop-sidebar", handleToggle);
  }, []);

  const handleClose = () => setIsOpen(false);

  const navItems = [
    {
      label: "Bảng điều khiển",
      href: "/shop",
      icon: PieChart,
    },
    {
      label: "Sản phẩm của tôi",
      href: "/shop/products",
      icon: Package,
    },
    {
      label: "Quản lý kho",
      href: "/shop/inventory",
      icon: Archive,
    },
    {
      label: "Đơn hàng",
      href: "/shop/orders",
      icon: ShoppingCart,
    },
    {
      label: "Doanh thu",
      href: "/shop/revenue",
      icon: DollarSign,
    },
    {
      label: "Cài đặt cửa hàng",
      href: "/shop/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={handleClose}
        />
      )}

      <aside
        id="shop-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-16 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800`}
        aria-label="Shop Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Mobile Header Brand */}
          <Link
            to="/shop"
            className="flex items-center ps-2.5 mb-5 sm:hidden"
            onClick={handleClose}
          >
            <span className="self-center text-lg font-semibold whitespace-nowrap text-zinc-900 dark:text-white">
              Cửa hàng của tôi
            </span>
          </Link>

          <ul className="space-y-1 font-medium text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/shop"
                  ? pathname === "/shop"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-green-600 dark:text-green-400" : "text-zinc-500 dark:text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};
