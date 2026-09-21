import { useState } from "react";
import {
  BookOpen,
  BadgeDollarSign,
  Receipt,
  Package,
  Store,
  AlertCircle,
  ChevronDown
} from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { Tooltip } from "@/components/ui/Tooltip";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { Link, useNavigate } from "react-router-dom";
import {
  getProductStatusInfo,
  type ProductStatus,
} from "@/modules/shop/products/types/product-status.type";
import type { SuperAdminProductResponse } from "@/modules/shop/products/types/product.type";
import { ProductActionMenu } from "./ProductActionMenu";
import { ProductApproveModal } from "./ProductApproveModal";
import { ProductRejectModal } from "./ProductRejectModal";

export interface ProductTableProps {
  products: SuperAdminProductResponse[];
  page?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onView?: (slug: string) => void;
}

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const { label, color } = getProductStatusInfo(status);
  return <Badge title={label} variant={color} />;
};

const ProductReasonCollapse = ({ reason }: { reason: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1 mt-1 max-w-md">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-900/50 px-2 py-0.5 rounded-lg transition-all duration-200 cursor-pointer w-fit select-none active:scale-95"
      >
        <AlertCircle size={12} className="shrink-0 text-rose-500" />
        <span>{isOpen ? "Thu gọn lý do" : "Xem lý do từ chối"}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-0.5"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 px-2.5 py-1.5 rounded-lg leading-relaxed whitespace-pre-line">
            {reason}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductTable = ({
  products,
  page = 1,
  pageSize = 10,
  totalElements = 0,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onView,
}: ProductTableProps) => {
  const navigate = useNavigate();

  // Modal state
  const [selectedProduct, setSelectedProduct] =
    useState<SuperAdminProductResponse | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const computedTotalPages =
    totalPages ?? (Math.ceil(totalElements / pageSize) || 1);

  const handleView = (slug: string) => {
    if (onView) {
      onView(slug);
    } else {
      navigate(`/admin/products/detail?slug=${slug}`);
    }
  };

  const handleApproveClick = (product: SuperAdminProductResponse) => {
    setSelectedProduct(product);
    setIsApproveOpen(true);
  };

  const handleRejectClick = (product: SuperAdminProductResponse) => {
    setSelectedProduct(product);
    setIsRejectOpen(true);
  };

  const handleApproveSuccess = () => {
    setIsApproveOpen(false);
    setSelectedProduct(null);
  };

  const handleRejectSuccess = () => {
    setIsRejectOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="hidden md:flex card-custom flex-col">
      <div className="overflow-x-auto overflow-hidden rounded-t-2xl">
        <table className="w-full text-left body-text text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 body-text uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4 w-[50%]">Sản phẩm</th>
              <th className="px-6 py-4 w-[20%]">Giá & Kho</th>
              <th className="px-6 py-4 w-[20%]">Trạng thái</th>
              <th className="px-6 py-4 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product, index) => {
              const stt = (page - 1) * pageSize + index + 1;

              return (
                <tr
                  key={
                    product.productId
                      ? `product-${product.productId}-${index}`
                      : index
                  }
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  {/* ── STT ── */}
                  <td className="px-4 py-4 text-center font-medium text-zinc-400 dark:text-zinc-500 body-text align-middle">
                    {stt}
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
                              alt={product.productName}
                              className="w-14 h-20 object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative shrink-0 overflow-hidden w-14 h-20 rounded-xl border border-dashed border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shadow-xs">
                            <BookOpen
                              size={20}
                              className="text-slate-300 dark:text-zinc-600"
                            />
                          </div>
                        )}
                      </div>

                      {/* Nội dung Tên + Shop + Reason */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        {/* Tên */}
                        <Link
                          to={`/admin/products/detail?slug=${product.productSlug}`}
                          className="font-semibold text-zinc-900 dark:text-zinc-100 body-text leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title={product.productName}
                        >
                          {product.productName}
                        </Link>

                        {/* Shop info */}
                        {product.shopName && (
                          <Link
                            to={`/admin/shops/detail?slug=${product.shopSlug}`}
                            className="body-text text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit"
                          >
                            <Store
                              size={11}
                              className="shrink-0 text-indigo-500"
                            />
                            {product.shopName}
                          </Link>
                        )}

                        {/* Lý do (Reason) */}
                        {product.reason && (
                          <ProductReasonCollapse reason={product.reason} />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ── GIÁ & KHO ── */}
                  <td className="py-3 px-6 align-middle">
                    <div className="flex flex-col gap-1 caption-text">
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
                        {product.originalPrice &&
                        product.originalPrice > product.price ? (
                          <Tooltip
                            content={`Bán lỗ -${formatMoney(product.originalPrice - product.price)} so với giá nhập`}
                            position="top"
                            variant="rose"
                            className="w-fit"
                          >
                            <span className="text-rose-500 font-medium text-[11px] cursor-help">
                              -
                              {formatMoney(
                                product.originalPrice - product.price,
                              )}
                            </span>
                          </Tooltip>
                        ) : product.originalPrice &&
                          product.price > product.originalPrice ? (
                          <Tooltip
                            content={`Lời +${formatMoney(product.price - product.originalPrice)} so với giá nhập`}
                            position="top"
                            variant="emerald"
                            className="w-fit"
                          >
                            <span className="text-emerald-500 font-medium text-[11px] cursor-help">
                              +
                              {formatMoney(
                                product.price - product.originalPrice,
                              )}
                            </span>
                          </Tooltip>
                        ) : null}
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

                  {/* ── TRẠNG THÁI ── */}
                  <td className="py-3 px-6 align-middle">
                    <ProductStatusBadge status={product.status} />
                  </td>

                  {/* ── THAO TÁC ── */}
                  <td className="py-3 px-6 text-right align-middle">
                    <ProductActionMenu
                      item={product}
                      onView={() => handleView(product.productSlug)}
                      onApprove={() => handleApproveClick(product)}
                      onReject={() => handleRejectClick(product)}
                    />
                  </td>
                </tr>
              );
            })}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-0">
                  <EmptyState title="Không tìm thấy dữ liệu" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && onPageChange && (
        <div className="px-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
          <Pagination
            currentPage={page}
            totalPages={computedTotalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}

      {/* Approve Modal */}
      <ProductApproveModal
        isOpen={isApproveOpen}
        item={selectedProduct}
        onClose={() => setIsApproveOpen(false)}
        onSuccess={handleApproveSuccess}
      />

      {/* Reject Modal */}
      <ProductRejectModal
        isOpen={isRejectOpen}
        item={selectedProduct}
        onClose={() => setIsRejectOpen(false)}
        onSuccess={handleRejectSuccess}
      />
    </div>
  );
};
