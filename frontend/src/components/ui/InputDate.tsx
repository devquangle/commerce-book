import React, { forwardRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

// Đăng ký ngôn ngữ Tiếng Việt cho DatePicker
registerLocale("vi", vi);

export interface InputDateProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  className?: string;
  value?: string | Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  showTimeSelect?: boolean;
  dateFormat?: string;
  id?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
}

export const InputDate = forwardRef<any, InputDateProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      className = "",
      containerClassName = "",
      value,
      onChange,
      placeholder = "Chọn ngày...",
      showTimeSelect = false,
      dateFormat = showTimeSelect ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy",
      id,
      minDate,
      maxDate,
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    // Chuyển đổi chuỗi thành Date (nếu truyền vào dạng chuỗi)
    let parsedDate: Date | null = null;
    if (value instanceof Date) {
      parsedDate = value;
    } else if (typeof value === "string" && value.length > 0) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        parsedDate = parsed;
      }
    }

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <DatePicker
            id={inputId}
            selected={parsedDate}
            onChange={(date: Date | null) => onChange?.(date)}
            showTimeSelect={showTimeSelect}
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Thời gian"
            dateFormat={dateFormat}
            locale="vi"
            placeholderText={placeholder}
            minDate={minDate || undefined}
            maxDate={maxDate || undefined}
            popperPlacement="bottom-start"
            className={`w-full h-10 pr-4 pl-11 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border rounded-xl focus:outline-none transition-all text-zinc-900 dark:text-white placeholder-zinc-400 ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-zinc-200 dark:border-zinc-700/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            } ${className}`}
            wrapperClassName="w-full"
            ref={ref}
            autoComplete="off"
          />
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

