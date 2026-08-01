import React, { useState } from "react";
import { BookOpen, Building2, Layers, Calendar, FileText, Weight, Languages, ChevronUp, ChevronDown, PenTool, Tag } from "lucide-react";
import { Pagination } from "../../../../components/common/Pagination";
import { type ProductResponse, getLabelProductStatus } from "../types/shop-product.type";
import { ProductActionMenu } from "./ProductActionMenu";

interface ProductTableProps {
  products: ProductResponse[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete: (id: number) => void;
}

const formatMoney = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
const getLanguageName = (code: string) => code;

const ExpandableAuthors = ({ authors }: { authors?: string[] }) => {
  if (!authors || authors.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded text-[10px] font-medium mr-1">
      <PenTool size={10} />
      <span>{authors.join(", ")}</span>
    </span>
  );
}

const ExpandableGenres = ({ genres }: { genres?: string[] }) => {
  if (!genres || genres.length === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
      <Tag size={10} />
      <span>{genres.join(", ")}</span>
    </span>
  );
}

const ProductStatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      status === "ACTIVE" 
        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
        : status === "INACTIVE"
        ? "bg-slate-50 text-slate-600 border border-slate-200"
        : "bg-rose-50 text-rose-600 border border-rose-200"
    }`}>
      {getLabelProductStatus(status)}
    </span>
  );
}



export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  totalElements,
  currentPage,
  totalPages,
  onPageChange,
  onDelete
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [showDetailsMap, setShowDetailsMap] = useState<Record<number, boolean>>({});

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    onPageChange(1);
  };

  const toggleDetails = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setShowDetailsMap(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <div className="card-custom overflow-hidden flex flex-col mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr className="text-slate-500">
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-12 text-center">
                STT
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider min-w-[240px]">
                Thông tin sản phẩm 
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-28">
                Giá nhập
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-28">
                Giá bán
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-24 text-center">
                Tồn kho
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider w-40">
                Trạng thái
              </th>
              <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-right w-16">
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="hover:bg-indigo-50/20 transition-colors group"
              >
                {/* ── STT ── */}
                <td className="py-4 px-4 text-slate-400 font-medium text-center align-middle text-xs">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>

                {/* ── THÔNG TIN SẢN PHẨM CHUNG ── */}
                <td className="py-3 px-4 align-middle">
                  <div className="flex gap-3 items-center">
                    {/* Ảnh bìa — kích thước cố định */}
                    <div className="shrink-0">
                      {product.urlImageDefault ? (
                        <div className="relative shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 shadow-sm group-hover:shadow-md transition-shadow">
                          <img
                            src={product.urlImageDefault}
                            alt={product.name}
                            className="w-[60px] h-[86px] object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative shrink-0 overflow-hidden w-[60px] h-[86px] rounded-xl border border-dashed border-slate-200/80 bg-slate-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <BookOpen size={20} className="text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Nội dung 3 nhóm */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      {/* ➊ Tên + ISBN */}
                      <div className="flex flex-col gap-0.5">
                        <p
                          className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                      </div>

                      <div 
                        className={`grid transition-all duration-300 ease-in-out ${
                          showDetailsMap[product.id] ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-1.5 pb-1">
                            {/* NXB + Series */}
                            {(product.publisherName || product.seriesName) && (
                              <div className="flex flex-wrap gap-1">
                                {product.publisherName && (
                                  <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                    <Building2 size={10} />
                                    <span>{product.publisherName}</span>
                                  </span>
                                )}
                                {product.seriesName && (
                                  <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                    <Layers size={10} />
                                    <span>{product.seriesName}</span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Tác giả + Thể loại */}
                            <div className="flex flex-wrap items-center">
                              <ExpandableAuthors authors={product.authorsName} />
                              <ExpandableGenres genres={product.genresName} />
                            </div>

                            {/* ➌ Năm XB · Số trang · Trọng lượng · Ngôn ngữ */}
                            {(product.publishYear ||
                              product.pages > 0 ||
                              product.weight > 0 ||
                              product.language) && (
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-400 mt-1">
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
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-0.5">
                        <button 
                          type="button" 
                          onClick={(e) => toggleDetails(product.id, e)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 transition cursor-pointer"
                        >
                          {showDetailsMap[product.id] ? "Thu gọn" : "Xem thêm chi tiết"}
                          {showDetailsMap[product.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>

                {/* ── GIÁ NHẬP ── */}
                <td className="py-4 px-4 align-middle">
                  <span className="text-sm text-slate-600 font-medium">
                    {formatMoney(product.originalPrice || product.price)}
                  </span>
                </td>

                {/* ── GIÁ BÁN ── */}
                <td className="py-4 px-4 align-middle">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-indigo-600 text-sm">
                      {formatMoney(product.price)}
                    </span>
                    {(product.originalPrice && product.originalPrice > product.price) ? (
                      <span className="text-[11px] text-rose-500 font-semibold">
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100,
                        )}
                        %
                      </span>
                    ) : null}
                  </div>
                </td>

                {/* ── TỒN KHO ── */}
                <td className="py-4 px-4 align-middle text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`font-bold text-sm ${
                        product.quantity === 0
                          ? "text-rose-600"
                          : product.quantity <= 10
                            ? "text-amber-600"
                            : "text-slate-700"
                      }`}
                    >
                      {product.quantity}
                    </span>
                    {product.quantity === 0 && (
                      <span className="text-[10px] text-rose-500 font-medium">
                        Hết hàng
                      </span>
                    )}
                    {product.quantity > 0 && product.quantity <= 10 && (
                      <span className="text-[10px] text-amber-500 font-medium">
                        Sắp hết
                      </span>
                    )}
                  </div>
                </td>

                {/* ── TRẠNG THÁI ── */}
                <td className="py-4 px-4 align-middle">
                  <ProductStatusBadge status={product.status} />
                </td>

                {/* ── THAO TÁC ── */}
                <td className="py-4 px-4 text-right align-middle">
                  <ProductActionMenu item={product} onDelete={onDelete} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-32 text-center text-slate-500">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {products.length > 0 && (
        <div className="px-4 bg-slate-50/50">
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
