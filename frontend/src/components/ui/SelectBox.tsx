import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface SelectOption {
  label: string;
  subLabel?: string;
  value: string | number;
  disabled?: boolean;
  image?: string;
  icon?: React.ReactNode;
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
  value?: string | number | null;
  defaultValue?: string | number | null;
  openDirection?: "up" | "down";
  searchable?: boolean;
  searchPlaceholder?: string;
  hideMessage?: boolean;
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
      searchable = false,
      searchPlaceholder = "Tìm kiếm...",
      hideMessage = false,
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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState<string | number>(
      value !== undefined && value !== null ? value : defaultValue !== undefined && defaultValue !== null ? defaultValue : ""
    );
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Keep state in sync with controlled value prop
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value !== null ? value : "");
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



    const filteredOptions = searchable
      ? options.filter((opt) =>
          String(opt.label || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(opt.subLabel || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    const selectedOption = options.find(
      (opt) => String(opt.value) === String(selectedValue)
    );

    const handleSelectOption = (opt: SelectOption) => {
      if (opt.disabled) return;

      const isAlreadySelected = String(opt.value) === String(selectedValue);
      const newValue = isAlreadySelected ? "" : opt.value;

      setSelectedValue(newValue);
      setIsOpen(false);
      if (searchable) setSearchTerm("");

      // Trigger native select change event so react-hook-form registers the update
      if (selectRef.current) {
        selectRef.current.value = String(newValue);
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
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300"
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
            <option value="" disabled={!searchable}>
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
              className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-1.5 text-sm bg-zinc-50 dark:bg-zinc-800/60 border rounded-xl transition-all text-left ${
                error
                  ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                  : "border-zinc-200 dark:border-zinc-700/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
            >
              <div className="flex items-center gap-3 truncate min-w-0">
                {selectedOption?.image && (
                  <div className="w-8 h-8 rounded-md bg-white p-1 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src={selectedOption.image}
                      alt={selectedOption.label}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                {selectedOption?.icon && (
                  <span className="shrink-0">{selectedOption.icon}</span>
                )}
                {selectedOption ? (
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="truncate text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                      {selectedOption.label}
                    </span>
                    {selectedOption.subLabel && (
                      <span className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">
                        {selectedOption.subLabel}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-zinc-400 text-sm">
                    {placeholder || "Chọn một mục..."}
                  </span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ms-2" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                className={`absolute z-50 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-80 overflow-hidden flex flex-col animate-in fade-in duration-100 ${
                  openDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
                }`}
              >
                {/* Search Bar inside Dropdown */}
                {searchable && (
                  <div className="p-2 border-b border-zinc-100 dark:border-zinc-800 relative">
                    <Search className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="w-full pl-8 pr-7 py-1.5 body-text bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-white placeholder-zinc-400"
                      autoFocus
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}

                <div className="overflow-y-auto p-1 max-h-59 space-y-0.5">
                  {filteredOptions.length === 0 ? (
                    <p className={`p-3 ${textClassName} text-center text-zinc-400 font-medium`}>
                      {searchable ? "Không tìm thấy kết quả" : "Không có lựa chọn nào"}
                    </p>
                  ) : (
                    filteredOptions.map((opt) => {
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
                          <div className="flex items-center gap-3 truncate min-w-0">
                            {opt.image && (
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white p-1 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-xs">
                                <img
                                  src={opt.image}
                                  alt={opt.label}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            {opt.icon && (
                              <span className="shrink-0">{opt.icon}</span>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="truncate text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                                {opt.label}
                              </span>
                              {opt.subLabel && (
                                <span className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                                  {opt.subLabel}
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ms-2" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

        {!hideMessage && (
          <div className="min-h-[20px] mt-1.5">
            {error ? (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            ) : helperText ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

SelectBox.displayName = "SelectBox";
