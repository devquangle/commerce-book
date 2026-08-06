import { useState } from "react";
import {
  BookOpen,
  Building2,
  Layers,
  Calendar,
  FileText,
  Weight,
  Languages,
  ChevronDown,
  ChevronUp,
  PenTool,
  Tag,
  Store,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProductActionMenu } from "./ProductActionMenu";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { Badge } from "@/components/common/Badge";
import { registerLocale, getNames } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";
import { getProductStatusInfo, type ProductStatus } from "@/modules/shop/products/types/product-status.type";
import type { ProductResponse } from "@/modules/shop/products/types/product.type";

registerLocale(viLocale);

const getLanguageName = (code: string) => {
  if (!code) return "";
  const names = getNames("vi");
  const name = names[code.toLowerCase()];
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : code;
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const { label, color } = getProductStatusInfo(status);
  return <Badge title={label} variant={color} />;
};

interface ProductMobileCardProps {
  product: ProductResponse;
  onView?: (product: ProductResponse) => void;
  onApprove?: (product: ProductResponse) => void;
  onReject?: (product: ProductResponse) => void;
}

export const ProductMobileCard= ({
  product,
  onView,
  onApprove,
  onReject,
}:ProductMobileCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const hasDetails =
    (product.authorsName && product.authorsName.length > 0) ||
    (product.genresName && product.genresName.length > 0) ||
    product.publisherName ||
    product.seriesName ||
    product.publishYear ||
    product.pages > 0 ||
    product.weight > 0 ||
    product.language;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
      {/* Khúc trên: Ảnh + Tên + Slug + Kho + Giá */}
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
            to={`/admin/products/detail?slug=${product.slug}`}
            className="font-semibold text-zinc-900 dark:text-white body-text leading-snug line-clamp-2 wrap-break-word hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Dòng 2: Shop → link đến shop detail */}
          {product.shop && (
            <Link
              to={`/admin/shops/detail?slug=${product.shop.shopSlug}`}
              className="body-text text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors w-fit mt-0.5"
            >
              <Store size={11} className="shrink-0 text-indigo-500" />
              {product.shop.shopName}
            </Link>
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
              <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">Giá bán:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{formatMoney(product.price)}</span>
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

      {/* Khúc mở rộng (Xem thêm / Thu gọn) */}
      {hasDetails && showDetails && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2 animate-in fade-in duration-150">
          {/* Tác giả & Thể loại */}
          <div className="flex flex-wrap gap-1">
            {product.authorsName && product.authorsName.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 px-1.5 py-0.5 rounded text-muted font-medium">
                <PenTool size={10} />
                <span>{product.authorsName.join(", ")}</span>
              </span>
            )}
            {product.genresName && product.genresName.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20 px-1.5 py-0.5 rounded text-muted font-medium">
                <Tag size={10} />
                <span>{product.genresName.join(", ")}</span>
              </span>
            )}
          </div>

          {/* NXB & Series */}
          {(product.publisherName || product.seriesName) && (
            <div className="flex flex-wrap gap-1">
              {product.publisherName && (
                <span className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20 px-1.5 py-0.5 rounded text-muted font-medium">
                  <Building2 size={10} />
                  <span>{product.publisherName}</span>
                </span>
              )}
              {product.seriesName && (
                <span className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20 px-1.5 py-0.5 rounded text-muted font-medium">
                  <Layers size={10} />
                  <span>{product.seriesName}</span>
                </span>
              )}
            </div>
          )}

          {/* Chi tiết phụ */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
            {product.publishYear && (
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {product.publishYear}
              </span>
            )}
            {product.pages > 0 && (
              <span className="flex items-center gap-1">
                <FileText size={10} />
                {product.pages} trang
              </span>
            )}
            {product.weight > 0 && (
              <span className="flex items-center gap-1">
                <Weight size={10} />
                {product.weight}g
              </span>
            )}
            {product.language && (
              <span className="flex items-center gap-1">
                <Languages size={10} />
                {getLanguageName(product.language)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dòng dưới: Trạng thái + Nút xem thêm + Menu thao tác */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-2.5 mt-0.5">
        <div className="flex items-center gap-2">
          <ProductStatusBadge status={product.status} />

          {hasDetails && (
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
            >
              <span>{showDetails ? "Thu gọn" : "Xem thêm"}</span>
              {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>

        <ProductActionMenu
          item={product}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
        />
      </div>
    </div>
  );
};
