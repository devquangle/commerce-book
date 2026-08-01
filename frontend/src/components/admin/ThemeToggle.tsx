import { useSyncExternalStore, useEffect } from "react";

const emptySubscribe = () => () => {};

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
  matchMedia.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    matchMedia.removeEventListener("change", callback);
  };
};

const getSnapshot = (): "dark" | "light" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getServerSnapshot = (): "dark" | "light" => "light";

export const ThemeToggle = () => {
  const theme = useSyncExternalStore(
    typeof window !== "undefined" ? subscribe : emptySubscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-sm focus:outline-none transition-colors"
      aria-label="Toggle theme"
      title={
        theme === "dark"
          ? "Chuyển sang chế độ Sáng"
          : "Chuyển sang chế độ Tối"
      }
    >
      {theme === "dark" ? (
        <svg
          className="w-5 h-5 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-zinc-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};
