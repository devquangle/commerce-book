import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export const UserMenu: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    <div className="flex items-center ms-3 relative" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="flex text-sm bg-zinc-800 rounded-full focus:ring-4 focus:ring-zinc-300 dark:focus:ring-zinc-600"
          aria-expanded={isDropdownOpen}
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="w-8 h-8 rounded-full object-cover"
            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
            alt="user photo"
            width={32}
            height={32}
          />
        </button>
      </div>
      {isDropdownOpen && (
        <div className="z-50 absolute right-0 top-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg w-44 divide-y divide-zinc-100 dark:divide-zinc-700">
          <div className="px-4 py-3" role="none">
            <p className="text-sm font-medium text-zinc-900 dark:text-white" role="none">
              Neil Sims
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate" role="none">
              neil.sims@flowbite.com
            </p>
          </div>
          <ul className="py-2 text-sm text-zinc-700 dark:text-zinc-200 font-medium" role="none">
            <li>
              <Link
                to="/admin"
                className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/admin/earnings"
                className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                Earnings
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
