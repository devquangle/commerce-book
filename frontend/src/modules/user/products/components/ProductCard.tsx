import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingCart, Store } from "lucide-react";
import type { ProductCardResponse } from "../types/product-card.type";
import { formatMoney, formatCompactNumber } from "@/libs/utils/formatMoney.utils";

interface ProductCardProps {
  product: ProductCardResponse;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card-custom p-0! group flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-3/4 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {/* Placeholder image since ProductCardResponse currently doesn't have an image field */}
        <img
          src={product.urlImageDefault}
          alt={product.productName}
          className="w-full h-full object-cover"
        />
        {product.discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            -{product.discountPercent}%
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className={`p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full ${product.isFavorite ? "text-red-500 dark:text-red-400" : "text-zinc-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400"} shadow-sm transition-colors`}
          >
            <Heart
              className={`w-4 h-4 ${product.isFavorite ? "fill-current" : ""}`}
            />
          </button>
          <button 
            className="p-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-2 mb-1 min-h-[48px]">
          <Link
            to={`/product-detail?slug=${product.productSlug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {product.productName}
          </Link>
        </h3>
        <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          <Link
            to={`/shops/${product.shopSlug}`}
            className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-full"
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{product.shopName}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {product.averageRating?.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            • Đã bán {formatCompactNumber(product.soldCount)}
          </span>
        </div>

        <div className="mt-2">
          <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
            {formatMoney(product.salePrice)}
          </span>
          {product.price > product.salePrice && (
            <span className="text-xs text-zinc-400 line-through ml-2">
              {formatMoney(product.price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
