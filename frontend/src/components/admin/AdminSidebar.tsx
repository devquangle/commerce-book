import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  PieChart,
  Package,
  Store,
  FolderTree,
  BookCopy,
  Layers,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  FileBarChart,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-admin-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-admin-sidebar", handleToggle);
  }, []);

  const handleClose = () => setIsOpen(false);

  const topNavItems = [
    {
      label: "Trang chủ",
      href: "/admin",
      icon: PieChart,
    },
    {
      label: "Quản lý sản phẩm",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Quản lý cửa hàng",
      href: "/admin/stores",
      icon: Store,
    },
  ];

  const categorySubItems = [
    {
      label: "Quản lý bộ sách",
      href: "/admin/series",
      icon: BookCopy,
    },
    {
      label: "Quản lý thể loại",
      href: "/admin/categories",
      icon: Layers,
    },
    {
      label: "Quản lý tác giả",
      href: "/admin/authors",
      icon: Users,
    },
    {
      label: "Quản lý nhà xuất bản",
      href: "/admin/publishers",
      icon: BookOpen,
    },
  ];

  const reportSubItems = [
    {
      label: "Báo cáo sản phẩm",
      href: "/admin/reports/products",
      icon: FileSpreadsheet,
    },
    {
      label: "Báo cáo cửa hàng",
      href: "/admin/reports/stores",
      icon: FileBarChart,
    },
  ];

  const isCategoryActive = categorySubItems.some((item) =>
    pathname.startsWith(item.href)
  );

  const isReportActive = reportSubItems.some((item) =>
    pathname.startsWith(item.href)
  );

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
        id="top-bar-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-16 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Mobile Header Brand */}
          <Link
            to="/admin"
            className="flex items-center ps-2.5 mb-5 sm:hidden"
            onClick={handleClose}
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 w-6 me-3"
              alt="Flowbite Logo"
            />
            <span className="self-center text-lg font-semibold whitespace-nowrap text-zinc-900 dark:text-white">
              Book Commerce Admin
            </span>
          </Link>

          <ul className="space-y-1 font-medium text-sm">
            {/* Main Navigation Items */}
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}

            {/* Quản lý danh mục Accordion / Submenu */}
            <li>
              <button
                type="button"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  isCategoryActive || isCategoriesOpen
                    ? "bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderTree className="w-5 h-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  <span>Quản lý danh mục</span>
                </div>
                {isCategoriesOpen ? (
                  <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {isCategoriesOpen && (
                <ul className="mt-1 space-y-1 ps-4">
                  {categorySubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = pathname.startsWith(subItem.href);

                    return (
                      <li key={subItem.href}>
                        <Link
                          to={subItem.href}
                          onClick={handleClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-xs font-medium ${
                            isSubActive
                              ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                          }`}
                        >
                          <SubIcon className="w-4 h-4 shrink-0" />
                          <span>{subItem.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {/* Thống kê Direct Link */}
            <li>
              <Link
                to="/admin/analytics"
                onClick={handleClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  pathname.startsWith("/admin/analytics")
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <BarChart3 className={`w-5 h-5 shrink-0 ${pathname.startsWith("/admin/analytics") ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}`} />
                <span>Thống kê</span>
              </Link>
            </li>

            {/* Báo cáo Accordion / Submenu */}
            <li>
              <button
                type="button"
                onClick={() => setIsReportsOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  isReportActive || isReportsOpen
                    ? "bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                  <span>Báo cáo</span>
                </div>
                {isReportsOpen ? (
                  <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {isReportsOpen && (
                <ul className="mt-1 space-y-1 ps-4">
                  {reportSubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = pathname.startsWith(subItem.href);

                    return (
                      <li key={subItem.href}>
                        <Link
                          to={subItem.href}
                          onClick={handleClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-xs font-medium ${
                            isSubActive
                              ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold"
                              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                          }`}
                        >
                          <SubIcon className="w-4 h-4 shrink-0" />
                          <span>{subItem.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};
