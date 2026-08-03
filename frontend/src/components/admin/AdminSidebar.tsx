import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  adminSidebarMenu,
  type AdminSidebarMenuItem,
} from "./admin-sidebar-menu";

export const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const isMenuItemActive = (item: AdminSidebarMenuItem): boolean => {
    if (item.href) {
      return item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href);
    }
    if (item.subItems) {
      return item.subItems.some((sub) => isMenuItemActive(sub));
    }
    return false;
  };

  const [userToggled, setUserToggled] = useState<{
    pathname: string;
    label: string | null;
  } | null>(null);

  const activeParent = adminSidebarMenu.find(
    (item) => item.subItems && isMenuItemActive(item)
  );

  const openMenuLabel =
    userToggled?.pathname === pathname
      ? userToggled.label
      : activeParent
      ? activeParent.label
      : null;

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-admin-sidebar", handleToggle);
    return () =>
      window.removeEventListener("toggle-admin-sidebar", handleToggle);
  }, []);

  const handleClose = () => setIsOpen(false);

  const toggleSubMenu = (label: string) => {
    const nextLabel = openMenuLabel === label ? null : label;
    setUserToggled({ pathname, label: nextLabel });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden transition-opacity duration-300 ease-in-out"
          onClick={handleClose}
        />
      )}

      <aside
        id="top-bar-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-17 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-1 body-text">
            {adminSidebarMenu.map((item) => {
              const Icon = item.icon;
              const hasSubItems = Boolean(
                item.subItems && item.subItems.length > 0
              );
              const parentActive = isMenuItemActive(item);
              const isExpanded = openMenuLabel === item.label;

              if (hasSubItems && item.subItems) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => toggleSubMenu(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out ${
                        parentActive
                          ? "bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                            parentActive
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                          isExpanded ? "rotate-180" : ""
                        } ${
                          parentActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-zinc-400"
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100 mt-1"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-1 ps-4 pb-0.5">
                          {item.subItems.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = subItem.href
                              ? subItem.href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(subItem.href)
                              : false;

                            return (
                              <li key={subItem.href || subItem.label}>
                                <Link
                                  to={subItem.href || "#"}
                                  onClick={handleClose}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ease-in-out body-text ${
                                    isSubActive
                                      ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold"
                                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                                  }`}
                                >
                                  <SubIcon
                                    className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                                      isSubActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : ""
                                    }`}
                                  />
                                  <span>{subItem.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }

              const isActive = isMenuItemActive(item);

              return (
                <li key={item.href || item.label}>
                  <Link
                    to={item.href || "#"}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-3 py-2.5 body-text rounded-xl transition-all duration-200 ease-in-out ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    />
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
