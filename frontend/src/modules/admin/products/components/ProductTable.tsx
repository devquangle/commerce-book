import{ useState } from "react";
import {
  BookOpen,
  Building2,
  Layers,
  Calendar,
  FileText,
  Weight,
  Languages,
  ChevronUp,
  ChevronDown,
  PenTool,
  Tag,
  BadgeDollarSign,
  Receipt,
  Package,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Tooltip } from "@/components/common/Tooltip";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";


import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { registerLocale, getNames } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";
import { useNavigate } from "react-router-dom";
import { getProductStatusInfo, type ProductStatus } from "@/modules/shop/products/types/product-status.type";
import type { ProductResponse } from "@/modules/shop/products/types/product.type";
import { ProductActionMenu } from "./ProductActionMenu";

registerLocale(viLocale);

export interface ProductTableProps {
  products: ProductResponse[];
  page?: number;
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onView?: (product: ProductResponse) => void;
  onApprove?: (product: ProductResponse) => void;
  onReject?: (product: ProductResponse) => void;
}

const getLanguageName = (code: string) => {
  if (!code) return "";
  const names = getNames("vi");
  const name = names[code.toLowerCase()];
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : code;
};

const ExpandableAuthors = ({ authors }: { authors?: string[] }) => {
  if (!authors || authors.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 px-1.5 py-0.5 rounded text-muted font-medium mr-1">
      <PenTool size={10} />
      <span>{authors.join(", ")}</span>
    </span>
  );
};

const ExpandableGenres = ({ genres }: { genres?: string[] }) => {
  if (!genres || genres.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20 px-1.5 py-0.5 rounded text-muted font-medium">
      <Tag size={10} />
      <span>{genres.join(", ")}</span>
    </span>
  );
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const { label, color } = getProductStatusInfo(status);
  return <Badge title={label} variant={color} />;
};

export const ProductTable= ({
  products,
  page,
  currentPage,
  pageSize: initialPageSize = 10,
  totalElements = 0,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onView,
  onApprove,
  onReject,
}:ProductTableProps) => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [showDetailsMap, setShowDetailsMap] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();

  const activePage = page ?? currentPage ?? 1;
  const computedTotalPages =
    totalPages ?? (Math.ceil(totalElements / pageSize) || 1);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    if (onPageSizeChange) {
      onPageSizeChange(size);
    } else if (onPageChange) {
      onPageChange(1);
    }
  };

  const handleView = (product: ProductResponse) => {
    if (onView) {
      onView(product);
    } else {
      navigate(`/admin/products/detail?slug=${product.slug}`);
    }
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
              const stt = (activePage - 1) * pageSize + index + 1;
              const isDetailsOpen = !!showDetailsMap[product.productId || product.id];

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
                              alt={product.name}
                              className="w-15 h-21.5 object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative shrink-0 overflow-hidden w-15 h-21.5 rounded-xl border border-dashed border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shadow-xs">
                            <BookOpen
                              size={20}
                              className="text-slate-300 dark:text-zinc-600"
                            />
                          </div>
                        )}
                      </div>

                      {/* Nội dung 3 nhóm */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        {/* ➊ Tên + Slug */}
                        <div className="flex flex-col gap-0.5">
                          <p
                            className="font-semibold text-zinc-900 dark:text-zinc-100 body-text leading-snug line-clamp-2 warp-break-word"
                            title={product.name}
                          >
                            {product.name}
                          </p>
                          <span className="text-muted font-mono break-all line-clamp-2" title={product?.slug}>
                            Slug: {product?.slug}
                          </span>
                        </div>

                        {/* ➋ Tác giả + Thể loại */}
                        <div className="flex flex-wrap items-center gap-1 text-muted">
                          <ExpandableAuthors authors={product.authorsName} />
                          <ExpandableGenres genres={product.genresName} />
                        </div>

                        {/* ➌ NXB + Series (nếu có) */}
                        {(product.publisherName || product.seriesName) && (
                          <div className="flex flex-wrap gap-1 text-muted">
                            {product.publisherName && (
                              <span className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20 px-1.5 py-0.5 rounded font-medium">
                                <Building2 size={10} />
                                <span>{product.publisherName}</span>
                              </span>
                            )}
                            {product.seriesName && (
                              <span className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20 px-1.5 py-0.5 rounded font-medium">
                                <Layers size={10} />
                                <span>{product.seriesName}</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* ➍ Chi tiết còn lại -> Ẩn/Hiện */}
                        {(product.publishYear ||
                          product.pages > 0 ||
                          product.weight > 0 ||
                          product.language) && (
                          <div className="flex flex-col gap-1 mt-0.5">
                            <div
                              className={`grid transition-all duration-300 ease-in-out ${
                                isDetailsOpen
                                  ? "grid-rows-[1fr] opacity-100 mt-1"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-muted pb-1">
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
                            </div>

                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const idKey = product.productId || product.id;
                                  setShowDetailsMap((prev) => ({
                                    ...prev,
                                    [idKey]: !prev[idKey],
                                  }));
                                }}
                                className="inline-flex items-center gap-1 text-muted font-medium hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                              >
                                {isDetailsOpen ? "Thu gọn" : "Xem thêm chi tiết"}
                                {isDetailsOpen ? (
                                  <ChevronUp size={12} />
                                ) : (
                                  <ChevronDown size={12} />
                                )}
                              </button>
                            </div>
                          </div>
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
                              {formatMoney(product.originalPrice - product.price)}
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
                              {formatMoney(product.price - product.originalPrice)}
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
                      onView={() => handleView(product)}
                      onApprove={onApprove}
                      onReject={onReject}
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
