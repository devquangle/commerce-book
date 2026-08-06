import React from "react";
import { Search, RotateCcw } from "lucide-react";
import {
  type ProductStatus,
  PRODUCT_STATUS_LIST,
  getProductStatusValue,
} from "@/modules/shop/products/types/product-status.type";
import { SelectBox } from "@/components/common/SelectBox";

interface ShopOption {
  label: string;
  value: string;
}

interface ProductFilterProps {
  keyword: string;
  status: ProductStatus | null;
  shopSlug?: string;
  shopOptions?: ShopOption[];
  onKeywordChange: (keyword: string) => void;
  onStatusChange: (status: ProductStatus | null) => void;
  onShopChange?: (shopSlug: string) => void;
  onReset: () => void;
}

const statusOptions = [
  { label: "Tất cả trạng thái", value: "" },
  ...PRODUCT_STATUS_LIST.map((st) => ({
    label: getProductStatusValue(st),
    value: st,
  })),
];

export const ProductFilter: React.FC<ProductFilterProps> = ({
  keyword,
  status,
  shopSlug = "",
  shopOptions = [],
  onKeywordChange,
  onStatusChange,
  onShopChange,
  onReset,
}) => {
  const formattedShopOptions = [
    { label: "Tất cả cửa hàng", value: "" },
    ...shopOptions,
  ];

  return (
    <div className="card-custom flex flex-col sm:flex-row gap-4">
      {/* Tìm kiếm keyword (Name / Slug) */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Tìm kiếm theo tên sản phẩm, slug..."
          className="block w-full pl-10 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Selectbox Cửa hàng */}
      {onShopChange && (
        <div className="min-w-48 sm:w-56">
          <SelectBox
            options={formattedShopOptions}
            value={shopSlug}
            placeholder="Tất cả cửa hàng"
            onChange={(e) => onShopChange(e.target.value)}
            containerClassName="w-full"
          />
        </div>
      )}

      {/* Selectbox Trạng thái + Nút Reset */}
      <div className="flex items-center gap-2 min-w-48 sm:w-52">
        <SelectBox
          options={statusOptions}
          value={status || ""}
          placeholder="Tất cả trạng thái"
          onChange={(e) =>
            onStatusChange(
              e.target.value ? (e.target.value as ProductStatus) : null
            )
          }
          containerClassName="w-full"
        />
        <button
          onClick={onReset}
          title="Làm mới bộ lọc"
          className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
};
