
import React from "react";

export const SidebarToggle: React.FC = () => {
  const handleToggle = () => {
    window.dispatchEvent(new CustomEvent("toggle-user-sidebar"));
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      className="sm:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700 font-medium rounded-lg text-sm p-2 focus:outline-none"
      aria-label="Open sidebar"
    >
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 7h14M5 12h14M5 17h10"
        />
      </svg>
    </button>
  );
};
