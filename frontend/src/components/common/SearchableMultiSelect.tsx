import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SearchableMultiSelectProps {
  label?: string;
  error?: React.ReactNode;
  helperText?: string;
  options: MultiSelectOption[];
  placeholder?: string;
  required?: boolean;
  searchPlaceholder?: string;
  containerClassName?: string;
  className?: string;
  value?: (string | number)[];
  onChange?: (values: (string | number)[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  maxSelection?: number;
  openDirection?: "up" | "down";
  id?: string;
  name?: string;
}

export const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder = "Chọn...",
  required,
  searchPlaceholder = "Tìm kiếm...",
  className = "",
  containerClassName = "",
  id,
  value = [],
  onChange,
  onBlur,
  disabled = false,
  maxSelection = 4,
  openDirection = "down",
}) => {
  const selectId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValues = Array.isArray(value) ? value : [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onBlur]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const otherOptionInOptions = options.find(
    (opt) => String(opt.value) === "-1" || opt.label.toLowerCase() === "khác"
  );

  const displayOptions =
    filteredOptions.length > 0
      ? filteredOptions
      : [otherOptionInOptions || { label: "Khác", value: -1 }];

  const selectedOptions = options.filter((opt) =>
    selectedValues.some((v) => String(v) === String(opt.value))
  );

  const handleToggleOption = (opt: MultiSelectOption) => {
    if (opt.disabled) return;

    const isSelected = selectedValues.some(
      (v) => String(v) === String(opt.value)
    );
    let updatedValues: (string | number)[];

    if (isSelected) {
      updatedValues = selectedValues.filter(
        (v) => String(v) !== String(opt.value)
      );
    } else {
      if (selectedValues.length >= maxSelection) return;
      updatedValues = [...selectedValues, opt.value];
    }

    onChange?.(updatedValues);
  };

  const handleRemoveValue = (val: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const updatedValues = selectedValues.filter(
      (v) => String(v) !== String(val)
    );
    onChange?.(updatedValues);
  };

  const isMaxReached = selectedValues.length >= maxSelection;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={selectId}
            className="block caption-text font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[11px] text-zinc-400 font-medium">
            {selectedValues.length}/{maxSelection}
          </span>
        </div>
      )}

      {/* Main Container / Trigger Box */}
      <div className="relative" ref={dropdownRef}>
        <div
          id={selectId}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className={`w-full min-h-[42px] flex items-center justify-between pl-3 pr-8 py-2 body-text bg-zinc-50 dark:bg-zinc-800/60 border rounded-xl transition-all cursor-pointer relative ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
              : "border-zinc-200 dark:border-zinc-700/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        >
          {/* Selected Badges Flex-Wrap List */}
          {selectedOptions.length === 0 ? (
            <span className="text-zinc-400 text-sm">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 w-full">
              {selectedOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50/90 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 rounded-lg transition-all shadow-xs"
                >
                  <span>{opt.label}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => handleRemoveValue(opt.value, e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleRemoveValue(opt.value, e as any);
                      }
                    }}
                    className="p-0.5 rounded-md hover:bg-blue-200/70 dark:hover:bg-blue-900/80 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors cursor-pointer"
                    title="Xóa"
                  >
                    <X className="w-3 h-3" />
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Right Chevron Down Icon */}
          <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute z-50 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col animate-in fade-in duration-100 ${
              openDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {/* Search Bar inside Dropdown */}
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

            {/* Notice if max selection reached */}
            {isMaxReached && (
              <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center justify-between">
                <span>Đã chọn tối đa {maxSelection} mục</span>
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto p-1 max-h-48 space-y-0.5">
              {displayOptions.length === 0 ? (
                <p className="p-3 caption-text text-center text-zinc-400 font-medium">
                  Không tìm thấy kết quả
                </p>
              ) : (
                displayOptions.map((opt) => {
                  const isSelected = selectedValues.some(
                    (v) => String(v) === String(opt.value)
                  );
                  const isOptionDisabled =
                    opt.disabled || (!isSelected && isMaxReached);

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={isOptionDisabled}
                      onClick={() => handleToggleOption(opt)}
                      className={`w-full flex items-center justify-between px-3 py-2 caption-text font-medium rounded-lg text-left transition-colors ${
                        isOptionDisabled
                          ? "opacity-40 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
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
};

export default SearchableMultiSelect;
