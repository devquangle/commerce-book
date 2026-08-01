import React from "react";
import { Link } from "react-router-dom";

import { SidebarToggle } from "./SidebarToggle";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export const AdminHeader: React.FC = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <SidebarToggle />
            <Link to="/admin" className="flex ms-2 md:me-24 items-center gap-3">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-6 w-6"
                alt="FlowBite Logo"
              />
              <span className="self-center text-lg font-semibold whitespace-nowrap text-zinc-900 dark:text-white">
                Flowbite
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
