import React, { useState } from "react";
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
import { Pagination } from "../../../../components/common/Pagination";
import { Tooltip } from "../../../../components/common/Tooltip";
import { Badge } from "../../../../components/common/Badge";
import {
  type ProductResponse,
  type ProductStatus,
  getProductStatusInfo,
} from "../types/shop-product.type";
import { ProductActionMenu } from "./ProductActionMenu";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { registerLocale, getNames } from "@cospired/i18n-iso-languages";
import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";

registerLocale(viLocale);

interface ProductTableProps {
  products: ProductResponse[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
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
    <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">
      <PenTool size={10} />
      <span>{authors.join(", ")}</span>
    </span>
  );
};

const ExpandableGenres = ({ genres }: { genres?: string[] }) => {
  if (!genres || genres.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-100 dark:border-sky-500/20 px-1.5 py-0.5 rounded text-[10px] font-medium">
      <Tag size={10} />
      <span>{genres.join(", ")}</span>
    </span>
  );
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const { label, color } = getProductStatusInfo(status);
  return <Badge title={label} variant={color} />;
};

export const ProductTable = ({
  products,
  totalElements,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}: ProductTableProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [showDetailsMap, setShowDetailsMap] = useState<Record<number, boolean>>(
    {},
  );

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    onPageChange(1);
  };

  const toggleDetails = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setShowDetailsMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="hidden md:flex card-custom flex-col">
      <div className="overflow-x-auto overflow-hidden rounded-t-2xl">
        <table className="w-full text-left body-text text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 caption-text uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4 w-[50%]">Sản phẩm</th>
              <th className="px-6 py-4 w-[20%]">Giá & Kho</th>
              <th className="px-6 py-4 w-[20%]">Trạng thái</th>
              <th className="px-6 py-4 text-right w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
            {products.map((product, index) => (
              <tr
                key={
                  product.productId
                    ? `product-${product.productId}-${index}`
                    : index
                }
                className="hover:bg-indigo-50/20 dark:hover:bg-indigo-500/10 transition-colors group"
              >
                {/* ── STT ── */}
                <td className="py-4 px-4 text-slate-400 dark:text-zinc-500 font-medium text-center align-middle caption-text">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                {/* ── THÔNG TIN SẢN PHẨM CHUNG ── */}
                <td className="py-3 px-6 align-middle">
                  <div className="flex gap-3 items-center">
                    {/* Ảnh bìa — kích thước cố định */}
                    <div className="shrink-0">
                      {product.urlImageDefault ? (
                        <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 shadow-sm group-hover:shadow-md transition-shadow">
                          <img
                            src={product.urlImageDefault}
                            alt={product.name}
                            className="w-15 h-21.5 object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative shrink-0 overflow-hidden w-15 h-21.5 rounded-xl border border-dashed border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
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
                          className="font-semibold text-slate-900 dark:text-zinc-100 body-text leading-snug line-clamp-2"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono truncate">
                          slug: {product?.slug}
                        </span>
                      </div>

                      {/* ➋ Tác giả + Thể loại */}
                      <div className="flex flex-wrap items-center gap-1">
                        <ExpandableAuthors authors={product.authorsName} />
                        <ExpandableGenres genres={product.genresName} />
                      </div>

                      {/* ➌ NXB + Series (nếu có) */}
                      {(product.publisherName || product.seriesName) && (
                        <div className="flex flex-wrap gap-1">
                          {product.publisherName && (
                            <span className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              <Building2 size={10} />
                              <span>{product.publisherName}</span>
                            </span>
                          )}
                          {product.seriesName && (
                            <span className="inline-flex items-center gap-1 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20 px-1.5 py-0.5 rounded text-[10px] font-medium">
                              <Layers size={10} />
                              <span>{product.seriesName}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* ➍ Chi tiết còn lại (Năm XB, số trang, trọng lượng, ngôn ngữ) -> Ẩn/Hiện */}
                      {(product.publishYear ||
                        product.pages > 0 ||
                        product.weight > 0 ||
                        product.language) && (
                        <div className="flex flex-col gap-1 mt-0.5">
                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              showDetailsMap[product.productId]
                                ? "grid-rows-[1fr] opacity-100 mt-1"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400 dark:text-zinc-500 pb-1">
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
                              onClick={(e) =>
                                toggleDetails(product.productId, e)
                              }
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                            >
                              {showDetailsMap[product.productId]
                                ? "Thu gọn"
                                : "Xem thêm chi tiết"}
                              {showDetailsMap[product.productId] ? (
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
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-zinc-400">
                        <BadgeDollarSign
                          size={13}
                          className="text-slate-400 dark:text-zinc-500 shrink-0"
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
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-zinc-100">
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
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-400">
                        <Package
                          size={13}
                          className="text-slate-400 dark:text-zinc-500 shrink-0"
                        />
                        {product.quantity > 0 ? (
                          <span>
                            Tồn kho{" "}
                            <span
                              className={`font-semibold ${
                                product.quantity <= 10
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-slate-700 dark:text-zinc-300"
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
                  <ProductActionMenu item={product} onDelete={onDelete} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-32 text-center text-slate-500 dark:text-zinc-400"
                >
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && (
        <div className="px-4 bg-slate-50/50 dark:bg-zinc-800/50">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
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
