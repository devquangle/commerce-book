import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  BadgeDollarSign,
  Receipt,
  Package,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Tooltip } from "@/components/common/Tooltip";
import { EmptyState } from "@/components/common/EmptyState";
import { type ProductResponse } from "@/modules/shop/products/types/product.type";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { useGetProductPromotions } from "../hooks/usePromotion";
import { PromotionTypeBadge } from "./PromotionTypeBadge";

export interface PromotionProductTableProps {
  products: ProductResponse[];
  page?: number;
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  selectedProductIds?: number[];
  onSelectProduct?: (productId: number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  productConfigs?: Record<number, { discountPercent?: number | string; maxQuantity?: number | string }>;
  onUpdateProductConfig?: (productId: number, field: 'discountPercent' | 'maxQuantity', value: number | string) => void;
  promotionId?: number;
}

export const PromotionProductTable: React.FC<PromotionProductTableProps> = ({
  products,
  page,
  currentPage,
  pageSize: initialPageSize = 10,
  totalElements = 0,
  totalPages,
  selectedProductIds = [],
  onSelectProduct,
  onSelectAll,
  onPageChange,
  onPageSizeChange,
  productConfigs = {},
  onUpdateProductConfig,
  promotionId,
}) => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  const productIds = products.map((p) => p.productId);
  const { data: promotionsData, isLoading: isLoadingPromotions } = useGetProductPromotions(productIds);

  const processedProductsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (promotionId && promotionsData) {
      promotionsData.forEach((prodPromo) => {
        if (processedProductsRef.current.has(prodPromo.productId)) return; // Only process once per product

        const matchedPromo = 
          (prodPromo.activePromotion?.promotionId === promotionId ? prodPromo.activePromotion : null) ||
          prodPromo.promotionHistory.find((h) => h.promotionId === promotionId);

        if (matchedPromo) {
          // Auto check
          if (onSelectProduct && !selectedProductIds.includes(prodPromo.productId)) {
            onSelectProduct(prodPromo.productId, true);
          }
          // Auto fill configs
          if (onUpdateProductConfig) {
            onUpdateProductConfig(prodPromo.productId, 'discountPercent', matchedPromo.discountPercent);
            onUpdateProductConfig(prodPromo.productId, 'maxQuantity', matchedPromo.maxQuantity);
          }
        }

        processedProductsRef.current.add(prodPromo.productId);
      });
    }
  }, [promotionsData, promotionId, selectedProductIds, onSelectProduct, onUpdateProductConfig]);

  const activePage = page ?? currentPage ?? 1;
  const computedTotalPages =
    totalPages ?? (Math.ceil(totalElements / pageSize) || 1);

  // Check if all current page products are selected
  const isAllSelected = products.length > 0 && products.every(p => selectedProductIds.includes(p.productId));
  const isSomeSelected = products.length > 0 && products.some(p => selectedProductIds.includes(p.productId)) && !isAllSelected;

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else if (onPageChange) {
      onPageChange(1);
    }
  };

  return (
    <div className="hidden md:flex card-custom flex-col">
      <div className="overflow-x-auto overflow-hidden rounded-t-2xl">
        <table className="w-full text-left body-text text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 body-text uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center align-middle">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isSomeSelected;
                    }
                  }}
                  onChange={() => {
                    if (onSelectAll) {
                      onSelectAll(!isAllSelected);
                    }
                  }}
                  className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 w-[35%]">Sản phẩm</th>
              <th className="px-6 py-4 w-[20%]">Giá & Kho</th>
              <th className="px-6 py-4 w-[20%]">Thiết lập</th>
              <th className="px-6 py-4 w-[25%] text-right">CT đang tham gia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product, index) => {
              const isSelected = selectedProductIds.includes(product.productId);

              return (
                <tr
                  key={
                    product.productId
                      ? `product-${product.productId}-${index}`
                      : index
                  }
                  className={`transition-colors ${isSelected ? "bg-blue-50/50 dark:bg-blue-500/10" : "hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30"}`}
                >
                  {/* ── CHECKBOX ── */}
                  <td className="px-4 py-4 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectProduct?.(product.productId, e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 cursor-pointer"
                    />
                  </td>

                  {/* ── THÔNG TIN SẢN PHẨM CHUNG ── */}
                  <td className="py-3 px-6 align-middle">
                    <div className="flex gap-3 items-center">
                      {/* Ảnh bìa */}
                      <div className="shrink-0">
                        {product.urlImageDefault ? (
                          <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 shadow-xs">
                            <img
                              src={product.urlImageDefault}
                              alt={product.name}
                              className="w-12 h-16 object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative shrink-0 overflow-hidden w-12 h-16 rounded-xl border border-dashed border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shadow-xs">
                            <BookOpen
                              size={20}
                              className="text-slate-300 dark:text-zinc-600"
                            />
                          </div>
                        )}
                      </div>

                      {/* Nội dung Tên + Slug */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p
                          className="font-semibold text-zinc-900 dark:text-zinc-100 body-text leading-snug line-clamp-2 warp-break-word"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        <span className="text-xs text-slate-500 font-mono break-all line-clamp-1" title={product?.slug}>
                          Slug: {product?.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* ── GIÁ & KHO ── */}
                  <td className="py-3 px-6 align-middle">
                    <div className="flex flex-col gap-1 text-xs">
                      {/* Dòng 1: Giá nhập */}
                      <Tooltip
                        content="Giá nhập"
                        position="top"
                        variant="dark"
                        className="w-fit"
                      >
                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                          <BadgeDollarSign
                            size={13}
                            className="text-zinc-400 dark:text-zinc-500 shrink-0"
                          />
                          <span>{formatMoney(product.originalPrice)}</span>
                        </div>
                      </Tooltip>

                      {/* Dòng 2: Giá bán */}
                      <div className="flex items-center gap-1.5 w-fit">
                        <Tooltip
                          content="Giá bán"
                          position="top"
                          variant="indigo"
                          className="w-fit"
                        >
                          <div className="flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                            <Receipt
                              size={13}
                              className="text-indigo-600 dark:text-indigo-400 shrink-0"
                            />
                            <span>{formatMoney(product.price)}</span>
                          </div>
                        </Tooltip>
                      </div>

                      {/* Dòng 3: Tồn kho */}
                      <Tooltip
                        content="Tồn kho"
                        position="top"
                        variant="dark"
                        className="w-fit"
                      >
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                          <Package
                            size={13}
                            className="text-zinc-400 dark:text-zinc-500 shrink-0"
                          />
                          {product.quantity > 0 ? (
                            <span>
                              Tồn kho{" "}
                              <span
                                className={`font-semibold ${
                                  product.quantity <= 10
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-zinc-700 dark:text-zinc-300"
                                }`}
                              >
                                {product.quantity}
                              </span>
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 font-medium">
                              Hết hàng
                            </span>
                          )}
                        </div>
                      </Tooltip>
                    </div>
                  </td>

                  {/* ── THIẾT LẬP ── */}
                  <td className="py-3 px-6 align-middle">
                    <div className="flex flex-col gap-2 items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 w-16 text-right">Giảm (%):</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={productConfigs[product.productId]?.discountPercent ?? 10}
                          onChange={(e) => onUpdateProductConfig?.(product.productId, 'discountPercent', e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-16 px-2 py-1 text-sm border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:disabled:bg-zinc-800"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500 w-16 text-right">SL Tối đa:</span>
                        <input
                          type="number"
                          min="0"
                          value={productConfigs[product.productId]?.maxQuantity ?? 10}
                          onChange={(e) => onUpdateProductConfig?.(product.productId, 'maxQuantity', e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-16 px-2 py-1 text-sm border rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:disabled:bg-zinc-800"
                        />
                      </div>
                    </div>
                  </td>

                  {/* ── CT ĐANG THAM GIA ── */}
                  <td className="py-3 px-6 text-right align-middle">
                    {(() => {
                      if (isLoadingPromotions) return <span className="text-xs text-zinc-400 italic">Đang tải...</span>;
                      
                      const prodPromo = promotionsData?.find(p => p.productId === product.productId);
                      const activePromo = prodPromo?.activePromotion;
                      const history = prodPromo?.promotionHistory || [];
                      
                      return (
                        <div className="flex flex-col gap-2 items-end">
                          {activePromo ? (
                            <div className="flex flex-col gap-1 items-end bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                              <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm line-clamp-1" title={activePromo.name}>
                                {activePromo.name}
                              </span>
                              <PromotionTypeBadge type={activePromo.promotionCampaignType} />
                              <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex flex-col items-end">
                                <span>Giảm: <strong className="text-blue-600 dark:text-blue-400">{activePromo.discountPercent}%</strong></span>
                                <span>SL Max: <strong>{activePromo.maxQuantity}</strong> | Đã bán: <strong>{activePromo.soldQuantity}</strong></span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400 italic">Không có CT đang chạy</span>
                          )}

                          {history.length > 0 && (
                            <button className="text-xs font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors mt-1 underline">
                              Xem lịch sử ({history.length})
                            </button>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-0">
                  <EmptyState title="Chưa có sản phẩm nào" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && onPageChange && (
        <div className="px-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
          <Pagination
            currentPage={activePage}
            totalPages={computedTotalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
};
