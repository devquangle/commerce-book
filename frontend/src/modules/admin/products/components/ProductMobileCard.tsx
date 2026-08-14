import React, { useState } from "react";
import { BookOpen, Store, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ProductActionMenu } from "./ProductActionMenu";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { Badge } from "@/components/common/Badge";
import {
  getProductStatusInfo,
  type ProductStatus,
} from "@/modules/shop/products/types/product-status.type";
import type { SuperAdminProductResponse } from "@/modules/shop/products/types/product.type";
import { ProductApproveModal } from "./ProductApproveModal";
import { ProductRejectModal } from "./ProductRejectModal";

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const { label, color } = getProductStatusInfo(status);
  return <Badge title={label} variant={color} />;
};

interface ProductMobileCardProps {
  product: SuperAdminProductResponse;
  onView?: (slug: string) => void;
  onApprove?: (product: SuperAdminProductResponse) => void;
  onReject?: (product: SuperAdminProductResponse) => void;
}

export const ProductMobileCard: React.FC<ProductMobileCardProps> = ({
  product,
  onView,
  onApprove,
  onReject,
}) => {
  const navigate = useNavigate();

  // Modal state
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const handleView = (slug: string) => {
    if (onView) {
      onView(slug);
    } else {
      navigate(`/admin/products/detail?slug=${slug}`);
    }
  };

  const handleApprove = () => {
    if (onApprove) {
      onApprove(product);
    } else {
      setIsApproveOpen(true);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(product);
    } else {
      setIsRejectOpen(true);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
      {/* Khúc trên: Ảnh + Tên + Shop + Reason + Kho + Giá */}
      <div className="flex items-start gap-3">
        <div className="w-16 h-24 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-zinc-700">
          {product.urlImageDefault ? (
            <img
              src={product.urlImageDefault}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              <BookOpen size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Dòng 1: Tên sách → link đến detail */}
          <Link
            to={`/admin/products/detail?slug=${product.productSlug}`}
            className="font-semibold text-zinc-900 dark:text-white body-text leading-snug line-clamp-2 wrap-break-word hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Dòng 2: Shop → link đến shop detail */}
          {product.shopName && (
            <Link
              to={`/admin/shops/detail?slug=${product.shopSlug}`}
              className="body-text text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit mt-0.5"
            >
              <Store size={11} className="shrink-0 text-indigo-500" />
              {product.shopName}
            </Link>
          )}

          {/* Lý do (nếu có) */}
          {product.reason && (
            <div className="flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 px-2 py-1 rounded-lg mt-0.5 w-fit">
              <AlertCircle size={12} className="shrink-0 mt-0.5 text-rose-500" />
              <span className="leading-snug line-clamp-2">
                <span className="font-semibold">Lý do: </span>
                {product.reason}
              </span>
            </div>
          )}

          {/* Giá nhập, Giá bán, Tồn kho */}
          <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
            {product.originalPrice && product.originalPrice > 0 ? (
              <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                <span className="text-[11px]">Giá nhập:</span>
                <span>{formatMoney(product.originalPrice)}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
              <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                Giá bán:
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {formatMoney(product.price)}
              </span>
            </div>

            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px]">Tồn kho:</span>
              <span
                className={`font-semibold ${
                  product.quantity <= 10
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {product.quantity > 0 ? product.quantity : "Hết hàng"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dòng dưới: Trạng thái + Menu thao tác */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-2.5 mt-0.5">
        <ProductStatusBadge status={product.status} />

        <ProductActionMenu
          item={product}
          onView={handleView}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      {/* Approve Modal */}
      <ProductApproveModal
        isOpen={isApproveOpen}
        item={product}
        onClose={() => setIsApproveOpen(false)}
      />

      {/* Reject Modal */}
      <ProductRejectModal
        isOpen={isRejectOpen}
        item={product}
        onClose={() => setIsRejectOpen(false)}
      />
    </div>
  );
};
