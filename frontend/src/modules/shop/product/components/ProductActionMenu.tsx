import React, { useState, useRef, useEffect } from "react";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import { type ProductResponse } from "../types/shop-product.type";

interface ProductActionMenuProps {
  item: ProductResponse;
  onDelete: (id: number) => void;
}

export const ProductActionMenu: React.FC<ProductActionMenuProps> = ({ item, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Nếu khoảng trống phía dưới màn hình ít hơn 160px thì mở menu hướng lên trên
      if (spaceBelow < 300) {
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
        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className={`absolute right-6 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-zinc-700 z-50 overflow-hidden flex flex-col py-1 ${
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-blue-600 transition-colors">
            <Eye className="w-4 h-4" />
            <span>Xem</span>
          </button>
          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors">
            <Edit className="w-4 h-4" />
            <span>Cập nhật</span>
          </button>
          <div className="h-px bg-slate-100 dark:bg-zinc-700 my-1 w-full" />
          <button 
            onClick={() => {
              setIsOpen(false);
              onDelete(item.id);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa</span>
          </button>
        </div>
      )}
    </div>
  );
};