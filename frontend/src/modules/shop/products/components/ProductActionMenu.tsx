import React, { useState, useRef, useEffect } from "react";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { type ProductResponse } from "../types/product.type";

interface ProductActionMenuProps {
  item: ProductResponse;
  onDelete: (id: number) => void;
  onEdit?: (product: ProductResponse) => void;
  onView?: (product: ProductResponse) => void;
}

export const ProductActionMenu: React.FC<ProductActionMenuProps> = ({
  item,
  onDelete,
  onEdit,
  onView,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelowWindow = window.innerHeight - rect.bottom;

      const container = dropdownRef.current.closest(
        ".card-custom, table, .overflow-x-auto, tbody"
      );
      const containerRect = container
        ? container.getBoundingClientRect()
        : null;
      const spaceBelowContainer = containerRect
        ? containerRect.bottom - rect.bottom
        : Infinity;

      if (spaceBelowWindow < 250 || spaceBelowContainer < 160) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
    setIsOpen((prev) => !prev);
  };

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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors inline-flex cursor-pointer"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-6 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden flex flex-col py-1 animate-in fade-in zoom-in-95 duration-100 ${
            openUpward
              ? "bottom-0 origin-bottom-right"
              : "top-0 origin-top-right"
          }`}
        >
          {onView && (
            <button
              onClick={() => {
                setIsOpen(false);
                onView(item);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 body-text text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Xem</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsOpen(false);
              if (onEdit) onEdit(item);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 body-text text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Cập nhật</span>
          </button>

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 w-full" />

          <button
            onClick={() => {
              setIsOpen(false);
              onDelete(item.id);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 body-text text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa</span>
          </button>
        </div>
      )}
    </div>
  );
};