import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "dark" | "muted";
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-3",
    xl: "w-12 h-12 border-4",
  };

  const variantClasses = {
    primary: "border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent",
    white: "border-white border-t-transparent",
    dark: "border-zinc-900 border-t-transparent dark:border-zinc-100 dark:border-t-transparent",
    muted: "border-zinc-400 border-t-transparent dark:border-zinc-500 dark:border-t-transparent",
  };

  return (
    <div
      role="status"
      aria-label="loading"
      className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <span className="sr-only">Đang tải...</span>
    </div>
  );
};
