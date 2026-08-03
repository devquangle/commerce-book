import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { adminAccountMenu } from "./admin-account-menu";
import { LogoutModal } from "../common/LogoutModal";
import { useAuth } from "@/context/useAuth";

export const AccountMenu: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {userInfo, logout} = useAuth();

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
        await   logout();
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

  const displayName = userInfo?.name || "Super Admin";
  const displayEmail = userInfo?.email || "admin@commercebook.com";

  return (
    <>
      <div className="flex items-center ms-3 relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex text-sm bg-zinc-800 rounded-full focus:ring-4 focus:ring-zinc-300 dark:focus:ring-zinc-600 cursor-pointer"
          aria-expanded={isDropdownOpen}
        >
          <span className="sr-only">Mở menu tài khoản</span>
          <img
            className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            src={userInfo?.avatarUrl || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
            alt="user photo"
            width={32}
            height={32}
          />
        </button>

        {isDropdownOpen && (
          <div className="z-50 absolute right-0 top-full mt-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg w-52 divide-y divide-zinc-100 dark:divide-zinc-800 animate-in fade-in zoom-in-95 duration-150">
            {/* User Info Header */}
            <div className="px-4 py-3">
              <p className="body-text font-semibold text-zinc-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="caption-text text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                {displayEmail}
              </p>
            </div>

            {/* Menu Items from admin-account-menu.ts */}
            <ul className="py-1.5 body-text text-zinc-700 dark:text-zinc-200 font-medium">
              {adminAccountMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href || "#"}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
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
                className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer text-left font-medium"
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
