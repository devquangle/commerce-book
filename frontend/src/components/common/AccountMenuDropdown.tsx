import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { LogoutModal } from "./LogoutModal";
import { useAuth } from "@/context/useAuth";

export interface AccountMenuItem {
  label: string;
  icon: React.ElementType;
  href?: string;
}

interface AccountMenuDropdownProps {
  menuItems: AccountMenuItem[];
  defaultRoleName?: string;
  defaultEmail?: string;
  defaultUserName?: string;
}

export const AccountMenuDropdown: React.FC<AccountMenuDropdownProps> = ({
  menuItems,
  defaultRoleName = "Người dùng",
  defaultEmail = "user@commercebook.com",
  defaultUserName = "user",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { userInfo, logout } = useAuth();

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

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      if (logout) {
        await logout();
      }
      setIsLogoutModalOpen(false);
      setIsDropdownOpen(false);
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = userInfo?.name || userInfo?.username || defaultRoleName;
  const displayEmail = userInfo?.email || defaultEmail;
  const displayUserName = userInfo?.username || userInfo?.name || defaultUserName;

  return (
    <>
      <div className="flex items-center ms-3 relative" ref={dropdownRef}>
        {/* Account Trigger Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-2.5 py-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus:outline-none"
          aria-expanded={isDropdownOpen}
        >
          <span className="sr-only">Mở menu tài khoản</span>
          <User className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />

          <span className="body-text font-medium text-zinc-700 dark:text-zinc-200 max-w-32.5 truncate">
            <span className="sm:hidden">Tài khoản</span>
            <span className="hidden sm:inline">{displayUserName}</span>
          </span>

          <ChevronDown
            className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="z-50 absolute right-0 top-full mt-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-60 overflow-hidden animate-in fade-in zoom-in-95 duration-150 divide-y divide-zinc-100 dark:divide-zinc-800">
            {/* User Info Header */}
            <div className="px-4 py-3 bg-zinc-50/80 dark:bg-zinc-800/50">
              <p className="body-text font-semibold text-zinc-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="caption-text text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {displayEmail}
              </p>
            </div>

            {/* Menu Items */}
            <ul className="py-1.5 body-text text-zinc-700 dark:text-zinc-200 font-medium">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href || "#"}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Logout Action */}
            <div className="py-1.5 body-text">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
};
