import React from "react";
import { SidebarToggle } from "./SidebarToggle";
import { AccountMenu } from "./AccountMenu";
import { Logo } from "../common/Logo";

export const AdminHeader: React.FC = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <SidebarToggle />
            <Logo href="/admin" className="px-3" />
          </div>
          <div className="flex items-center gap-2">
            <AccountMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};
