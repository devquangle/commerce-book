"use client";

import React from "react";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-semibold transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variantClasses = {
      primary:
        "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm shadow-blue-500/20 focus:ring-blue-500",
      secondary:
        "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-500",
      outline:
        "border border-zinc-200 dark:border-zinc-700 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 focus:ring-blue-500",
      ghost:
        "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:ring-zinc-500",
      danger:
        "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-500/20 focus:ring-red-500",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-5 py-2.5 text-base gap-2.5",
    };

    const spinnerVariantMap = {
      primary: "white" as const,
      secondary: "dark" as const,
      outline: "primary" as const,
      ghost: "primary" as const,
      danger: "white" as const,
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${
          sizeClasses[size]
        } ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" variant={spinnerVariantMap[variant]} />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
