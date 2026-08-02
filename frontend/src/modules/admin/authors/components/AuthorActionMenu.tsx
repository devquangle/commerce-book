import React, { useState, useRef, useEffect } from "react";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { type AuthorResponse } from "../types/author.type";

interface AuthorActionMenuProps {
  item: AuthorResponse;
  onEdit: (author: AuthorResponse) => void;
  onDelete: (author: AuthorResponse) => void;
}

export const AuthorActionMenu: React.FC<AuthorActionMenuProps> = ({ item, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 250) {
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
        className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors inline-flex"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className={`absolute right-6 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-zinc-200 dark:border-zinc-700 z-50 overflow-hidden flex flex-col py-1 ${
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >

          <button 
            onClick={() => {
              setIsOpen(false);
              onEdit(item);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Sửa</span>
          </button>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 w-full" />
          <button 
            onClick={() => {
              setIsOpen(false);
              onDelete(item);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa</span>
          </button>
        </div>
      )}
    </div>
  );
};
