import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectBoxProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "defaultValue"> {
  label?: string;
  error?: React.ReactNode;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  containerClassName?: string;
  textClassName?: string;
  value?: string | number;
  defaultValue?: string | number;
  openDirection?: "up" | "down";
}

export const SelectBox = React.forwardRef<HTMLSelectElement, SelectBoxProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      required,
      className = "",
      containerClassName = "",
      textClassName = "caption-text",
      id,
      value,
      defaultValue,
      onChange,
      onBlur,
      disabled,
      name,
      openDirection = "down",
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const selectRef = useRef<HTMLSelectElement | null>(null);

    // Combine forwarded ref and local ref
    const setRefs = (element: HTMLSelectElement | null) => {
      selectRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLSelectElement | null>).current = element;
      }
    };

    // State for custom dropdown
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | number>(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ""
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Keep state in sync with controlled value prop
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    // Close dropdown on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);



    const selectedOption = options.find(
      (opt) => String(opt.value) === String(selectedValue)
    );

    const handleSelectOption = (opt: SelectOption) => {
      if (opt.disabled) return;

      setSelectedValue(opt.value);
      setIsOpen(false);

      // Trigger native select change event so react-hook-form registers the update
      if (selectRef.current) {
        selectRef.current.value = String(opt.value);
        const event = new Event("change", { bubbles: true });
        selectRef.current.dispatchEvent(event);
      }

      if (onChange && selectRef.current) {
        const syntheticEvent = {
          target: selectRef.current,
          currentTarget: selectRef.current,
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className={`space-y-2 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Hidden Native Select element for react-hook-form & accessibility */}
        <select
          ref={setRefs}
          id={selectId}
          name={name}
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
            if (onChange) onChange(e);
          }}
          onBlur={onBlur}
          disabled={disabled}
          className="sr-only"
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom Dropdown (Always rendered instead of native select) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setIsOpen((prev) => !prev)}
              className={`w-full h-10 flex items-center justify-between px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/60 border rounded-xl transition-all text-left ${
                error
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-zinc-200 dark:border-zinc-700/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
            >
              <span
                className={`truncate ${
                  selectedOption
                    ? "text-zinc-900 dark:text-white font-medium"
                    : "text-zinc-400"
                }`}
              >
                {selectedOption ? selectedOption.label : placeholder || "Chọn một mục..."}
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ms-2" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                className={`absolute z-50 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col animate-in fade-in duration-100 ${
                  openDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
                }`}
              >


                <div className="overflow-y-auto p-1 max-h-48 space-y-0.5">
                  {options.length === 0 ? (
                    <p className={`p-3 ${textClassName} text-center text-zinc-400 font-medium`}>
                      Không có lựa chọn nào
                    </p>
                  ) : (
                    options.map((opt) => {
                      const isSelected = String(opt.value) === String(selectedValue);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          disabled={opt.disabled}
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full flex items-center justify-between px-3 py-2 ${textClassName} font-medium rounded-lg text-left transition-colors ${
                            opt.disabled
                              ? "opacity-40 cursor-not-allowed"
                              : isSelected
                              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                              : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
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

SelectBox.displayName = "SelectBox";
