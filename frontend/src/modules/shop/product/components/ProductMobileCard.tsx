import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { type ProductResponse, getLabelProductStatus } from "../types/shop-product.type";

interface ProductMobileCardProps {
  product: ProductResponse;
  onDelete: (id: number) => void;
}

export const ProductMobileCard: React.FC<ProductMobileCardProps> = ({ product, onDelete }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
          {product.urlImageDefault ? (
            <img src={product.urlImageDefault} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">?</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-900 dark:text-white line-clamp-2 text-sm">{product.name}</h3>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{product.genresName?.join(", ")}</p>
          <div className="mt-2 font-medium text-zinc-900 dark:text-white text-sm">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-3 mt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Kho: {product.quantity}</span>
          <span className="text-xs text-zinc-300 dark:text-zinc-600">•</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
            product.status === "ACTIVE" 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : product.status === "INACTIVE"
              ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {getLabelProductStatus(product.status)}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
