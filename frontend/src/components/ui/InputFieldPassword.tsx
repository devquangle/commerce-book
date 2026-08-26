"use client";

import React, { useState, useId } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputFieldPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const InputFieldPassword = ({
  label,
  error,
  helperText,
  containerClassName = "",
  className = "",
  id,
  ref,
  ...props
}: InputFieldPasswordProps) => {
  const defaultId = useId();
  const inputId = id ?? defaultId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const [showPassword, setShowPassword] = useState(false);
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300"
        >
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={showPassword ? "text" : "password"}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`w-full h-10 px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border rounded-xl focus:outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400 pr-11 ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-zinc-200 dark:border-zinc-700/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none"
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="min-h-5 mt-1.5">
        {error ? (
          <p id={errorId} className="text-xs text-red-500 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-zinc-500 dark:text-zinc-400">
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export { InputFieldPassword };
export default InputFieldPassword;
