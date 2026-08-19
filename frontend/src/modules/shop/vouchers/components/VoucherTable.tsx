import React from "react";
import {
  Ticket,
  Calendar,
  DollarSign,
  Percent,
  Hash,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Tooltip } from "@/components/common/Tooltip";
import { EmptyState } from "@/components/common/EmptyState";
import { type VoucherResponse } from "../types/voucher.type";
import { VoucherActionMenu } from "./VoucherActionMenu";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { useNavigate } from "react-router-dom";
import { VoucherStatusBadge } from "./VoucherStatus";

export interface VoucherTableProps {
  vouchers: VoucherResponse[];
  page?: number;
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit?: (voucher: VoucherResponse) => void;
  onDelete?: (voucher: VoucherResponse) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const VoucherTable: React.FC<VoucherTableProps> = ({
  vouchers,
  page,
  currentPage,
  pageSize: initialPageSize = 10,
  totalElements = 0,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
}) => {
  const [pageSize, setPageSize] = React.useState(initialPageSize);
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

  const handleEdit = (voucher: VoucherResponse) => {
    if (onEdit) {
      onEdit(voucher);
    } else {
      navigate(`/shop/vouchers/update/${voucher.id}`);
    }
  };

  const handleDelete = (voucher: VoucherResponse) => {
    if (onDelete) {
      onDelete(voucher);
    }
  };

  return (
    <div className="hidden md:flex card-custom flex-col">
      <div className="overflow-x-auto overflow-hidden rounded-t-2xl">
        <table className="w-full text-left body-text text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 body-text uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4 w-[30%]">Voucher</th>
              <th className="px-6 py-4 w-[25%]">Chi tiết giảm giá</th>
              <th className="px-6 py-4 w-[20%]">Sử dụng & Thời gian</th>
              <th className="px-6 py-4 w-[15%]">Trạng thái</th>
              <th className="px-6 py-4 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {vouchers.map((voucher, index) => {
              const stt = (activePage - 1) * pageSize + index + 1;

              return (
                <tr
                  key={
                    voucher.id
                      ? `voucher-${voucher.id}-${index}`
                      : index
                  }
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  {/* ── STT ── */}
                  <td className="px-4 py-4 text-center font-medium text-zinc-400 dark:text-zinc-500 body-text align-middle">
                    {stt}
                  </td>

                  {/* ── THÔNG TIN VOUCHER CHUNG ── */}
                  <td className="py-3 px-6 align-middle">
                    <div className="flex gap-3 items-start">
                      <div className="relative shrink-0 overflow-hidden w-12 h-12 rounded-xl border border-dashed border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shadow-xs mt-1">
                        <Ticket
                          size={20}
                          className="text-slate-400 dark:text-zinc-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p
                          className="font-semibold text-zinc-900 dark:text-zinc-100 body-text leading-snug line-clamp-2"
                          title={voucher.name}
                        >
                          {voucher.name}
                        </p>
                        <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded w-fit border border-indigo-100 dark:border-indigo-500/20">
                          {voucher.code}
                        </span>
                        {voucher.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5" title={voucher.description}>
                            {voucher.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* ── CHI TIẾT GIẢM GIÁ ── */}
                  <td className="py-3 px-6 align-middle">
                    <div className="flex flex-col gap-1.5 caption-text">
                      <Tooltip content="Mức giảm" position="top">
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                          <Percent size={13} className="shrink-0" />
                          <span>Giảm {voucher.discountPercent}%</span>
                        </div>
                      </Tooltip>
                      <Tooltip content="Đơn tối thiểu" position="top">
                        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                          <DollarSign size={13} className="shrink-0" />
                          <span>Đơn tối thiểu: {formatMoney(voucher.minOrderValue)}</span>
                        </div>
                      </Tooltip>
                      {voucher.maxDiscount > 0 && (
                        <Tooltip content="Giảm tối đa" position="top">
                          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
                            <DollarSign size={11} className="shrink-0" />
                            <span>Tối đa: {formatMoney(voucher.maxDiscount)}</span>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  </td>

                  {/* ── SỬ DỤNG & THỜI GIAN ── */}
                  <td className="py-3 px-6 align-middle">
                    <div className="flex flex-col gap-1.5 caption-text">
                      <Tooltip content="Lượt sử dụng" position="top">
                        <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                          <Hash size={13} className="shrink-0 text-zinc-400" />
                          <span>
                            Đã dùng: <span className="font-semibold">{voucher.usedCount}</span> / {voucher.usageLimit}
                          </span>
                        </div>
                      </Tooltip>
                      <Tooltip content="Thời gian áp dụng" position="top">
                        <div className="flex flex-col gap-0.5 text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="shrink-0" />
                            <span>Từ: {formatDate(voucher.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="shrink-0 opacity-0" />
                            <span>Đến: {formatDate(voucher.endDate)}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </div>
                  </td>

                  {/* ── TRẠNG THÁI ── */}
                  <td className="py-3 px-6 align-middle">
                    <VoucherStatusBadge status={voucher.status} />
                  </td>

                  {/* ── THAO TÁC ── */}
                  <td className="py-3 px-6 text-right align-middle">
                    <VoucherActionMenu
                      item={voucher}
                      onDelete={() => handleDelete(voucher)}
                      onEdit={() => handleEdit(voucher)}
                    />
                  </td>
                </tr>
              );
            })}

            {vouchers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState title="Không tìm thấy dữ liệu voucher" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {vouchers.length > 0 && onPageChange && (
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
