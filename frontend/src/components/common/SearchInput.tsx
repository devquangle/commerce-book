import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  RegisterOptions,
} from "react-hook-form";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps<TForm extends FieldValues, TOption> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "onChange" | "onSelect" | "type"
> {
  label?: string;
  inputType?: string;
  name: Path<TForm>;
  register: UseFormRegister<TForm>;
  rules?: RegisterOptions<TForm, Path<TForm>>;
  error?: FieldError;
  value?: string | number | readonly string[] | null;
  dataOptions: TOption[];
  displayKey: keyof TOption;
  valueKey?: keyof TOption;
  onSelect?: (item: TOption) => void;
  renderItem?: (item: TOption) => React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  defaultMessage?: string;
  disableLocalFilter?: boolean;
}
export const SearchInput = <TForm extends FieldValues, TOption>({
  label,
  name,
  placeholder = "Tìm kiếm...",
  register,
  inputType = "text",
  rules,
  error,
  required = false,
  disabled = false,
  className = "",
  dataOptions = [],
  displayKey,
  valueKey,
  onSelect,
  renderItem,
  isLoading = false,
  loadingMessage = "Đang tìm kiếm...",
  emptyMessage = "Không tìm thấy kết quả phù hợp",
  defaultMessage = "Nhập từ khóa để tìm kiếm...",
  disableLocalFilter = false,
  ...rest
}: SearchInputProps<TForm, TOption>) => {
  const hasRequiredRule = rules?.required !== undefined;

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ref: registerRef,
    onChange: _onChange,
    ...registerRest
  } = register(name, rules);

  // Xử lý trường hợp component cha truyền null vào
  const safeDataOptions = useMemo(() => dataOptions || [], [dataOptions]);

  // Đồng bộ với value từ bên ngoài (nếu có, ví dụ từ react-hook-form useWatch)
  const currentValue =
    rest.value !== undefined && rest.value !== null
      ? String(rest.value)
      : query;

  useEffect(() => {
    if (rest.value !== undefined && rest.value !== null) {
      setQuery(String(rest.value));
    }
  }, [rest.value]);

  // Lọc danh sách theo query có tối ưu hiệu suất (chỉ tính toán lại khi data hoặc currentValue thay đổi)
  const filtered = useMemo(() => {
    if (disableLocalFilter) return safeDataOptions;
    if (currentValue.trim() === "") return safeDataOptions;
    const lowerQuery = currentValue.toLowerCase();
    return safeDataOptions.filter((item) =>
      String(item[displayKey]).toLowerCase().includes(lowerQuery),
    );
  }, [currentValue, safeDataOptions, displayKey, disableLocalFilter]);

  // Xử lý click ra ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (item: TOption) => {
      const newValue = String(item[displayKey]);
      if (rest.value === undefined) setQuery(newValue);
      setIsOpen(false);
      setHighlightIndex(-1);

      // Lưu ID duy nhất của item được chọn
      const uniqueId = valueKey
        ? String(item[valueKey])
        : `${String(item[displayKey])}-${safeDataOptions.indexOf(item)}`;
      setSelectedId(uniqueId);

      _onChange({
        target: { name, value: newValue },
        type: "change",
      });

      onSelect?.(item);
    },
    [
      displayKey,
      valueKey,
      name,
      rest.value,
      _onChange,
      onSelect,
      safeDataOptions,
    ],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") setIsOpen(true);
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightIndex >= 0 && filtered[highlightIndex]) {
            handleSelect(filtered[highlightIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightIndex(-1);
          break;
      }
    },
    [isOpen, filtered, highlightIndex, handleSelect],
  );

  const handleClear = useCallback(() => {
    if (rest.value === undefined) setQuery("");
    setIsOpen(false);
    setHighlightIndex(-1);
    _onChange({
      target: { name, value: "" },
      type: "change",
    });
  }, [rest.value, name, _onChange]);

  return (
    <div className="w-full space-y-1.5" ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-xs font-bold uppercase tracking-wide text-slate-600"
        >
          {label}
          {(required || hasRequiredRule) && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      {/* Vùng chứa Input và Dropdown */}
      <div className="relative">
        <div
          className={`
            relative flex h-11 w-full mb-1.5 items-center rounded-xl border bg-white px-3 transition-all
            ${
              error
                ? "border-red-500 bg-red-50"
                : "border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 hover:border-slate-400"
            }
            ${disabled ? "cursor-not-allowed bg-slate-100 opacity-70" : ""}
          `}
        >
          <Search size={16} className="shrink-0 text-slate-400" />

          <input
            id={name}
            type={inputType}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete="off"
            value={currentValue}
            onChange={(e) => {
              if (rest.value === undefined) setQuery(e.target.value);
              setIsOpen(true);
              setHighlightIndex(-1);
              _onChange(e);
            }}
            onFocus={() => {
              if (!disabled) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            ref={registerRef}
            {...registerRest}
            {...rest}
            className={`
              h-full w-full bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400
              ${className}
            `}
          />

          {currentValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="flex shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown danh sách */}
        <div
          className={`
            absolute left-0 right-0 z-50 mt-1.5 origin-top overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg transition-all
            ${isOpen && !disabled ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}
          `}
        >
          <div className="max-h-60 overflow-y-auto p-1.5">
            {isLoading ? (
              <div className="py-6 flex items-center justify-center text-sm italic text-slate-500">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {loadingMessage}
              </div>
            ) : currentValue.trim() === "" && safeDataOptions.length === 0 ? (
              <div className="py-6 text-center text-sm italic text-slate-400">
                {defaultMessage}
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((item, idx) => {
                const isHighlighted = idx === highlightIndex;
                const itemId = valueKey
                  ? String(item[valueKey])
                  : `${String(item[displayKey])}-${safeDataOptions.indexOf(item)}`;
                const isSelected = selectedId === itemId;

                return (
                  <div
                    key={`${String(item[displayKey])}-${idx}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                    }}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    className={`
                      flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors
                      ${
                        isHighlighted
                          ? "bg-indigo-100 text-indigo-900"
                          : isSelected
                            ? "bg-indigo-50 font-medium text-indigo-900"
                            : "text-slate-700 hover:bg-slate-50"
                      }
                    `}
                  >
                    {renderItem ? (
                      renderItem(item)
                    ) : (
                      <span>{String(item[displayKey])}</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-sm italic text-slate-400">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
