import React from "react";
import { Link } from "react-router-dom";
import { Star, Store } from "lucide-react";
import type { ProductCardResponse } from "../types/product-card.type";
import { formatMoney, formatCompactNumber } from "@/libs/utils/formatMoney.utils";

interface ProductCardProps {
  product: ProductCardResponse;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card-custom p-0! group flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {/* Placeholder image since ProductCardResponse currently doesn't have an image field */}
        <img
          src={product.urlImageDefault}
          alt={product.productName}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-2.5 flex flex-col flex-1">
        <h3 className="font-medium caption-text text-zinc-800 dark:text-zinc-100 line-clamp-2 mb-1 min-h-8 leading-relaxed">
          <Link
            to={`/product-detail?slug=${product.productSlug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {product.productName}
          </Link>
        </h3>

        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="caption-text font-medium dark:text-zinc-300">
              {product.averageRating?.toFixed(1)}
            </span>
          </div>
          <span className="caption-text dark:text-zinc-400">
            • Đã bán {formatCompactNumber(product.soldCount)}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 mb-1">
          <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
            {formatMoney(product.salePrice)}
          </span>
          {product.price > product.salePrice && (
            <div className="flex items-center gap-1">
              <span className="caption-text line-through dark:text-zinc-400">
                {formatMoney(product.price)}
              </span>
              {product.discountPercent > 0 && (
                <span className="bg-red-50 text-red-500 border border-red-200 text-[9px] font-bold px-1 py-0.5 rounded-xs leading-none">
                  -{product.discountPercent}%
                </span>
              )}
            </div>
          )}
        </div>

        <div className="caption-text mt-auto border-t border-zinc-100 dark:border-zinc-800 pt-1.5 dark:text-zinc-400">
          <Link
            to={`/shops/${product.shopSlug}`}
            className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors max-w-full"
          >
            <Store className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{product.shopName}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
