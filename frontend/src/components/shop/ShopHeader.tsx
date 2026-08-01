import React from "react";
import { Link } from "react-router-dom";
import { Menu, Store } from "lucide-react";
import { ThemeToggle } from "../admin/ThemeToggle"; // Reusing the admin one for now
import { ShopUserMenu } from "./ShopUserMenu";

const ShopSidebarToggle = () => {
  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-shop-sidebar"));
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="sm:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700 font-medium rounded-lg text-sm p-2 focus:outline-none mr-2"
      aria-label="Open sidebar"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
};

export const ShopHeader: React.FC = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <ShopSidebarToggle />
            <Link to="/shop" className="flex md:me-24 items-center gap-3">
              <div className="bg-green-600 text-white p-1 rounded-md">
                <Store className="w-5 h-5" />
              </div>
              <span className="self-center text-lg font-semibold whitespace-nowrap text-zinc-900 dark:text-white">
                Seller Center
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <ShopUserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
