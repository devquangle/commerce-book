import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, FileText, Settings, LogOut, LogIn, UserPlus } from "lucide-react";

export const StorefrontUserMenu: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="hidden sm:block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-expanded={isDropdownOpen}
      >
        <User className="w-5 h-5" />
      </button>

      {isDropdownOpen && (
        <div className="z-50 absolute right-0 top-17 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-64 overflow-hidden">
          {isLoggedIn ? (
            <>
              {/* Header section (Logged In) */}
              <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Khách Hàng
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                  khachhang@example.com
                </p>
              </div>
              
              <ul className="py-1 text-sm text-zinc-700 dark:text-zinc-200 font-medium">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    Quản lý tài khoản
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FileText className="w-4 h-4 text-zinc-400" />
                    Đơn hàng của tôi
                  </Link>
                </li>
                <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>
                <li>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 text-red-600 dark:text-red-400 transition-colors"
                    onClick={() => {
                      setIsLoggedIn(false);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <>
              {/* Guest section (Not Logged In) */}
              <div className="p-5 flex flex-col gap-3">
                <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-2">
                  Đăng nhập để theo dõi đơn hàng và nhận ưu đãi!
                </p>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-sm font-semibold rounded-xl transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
