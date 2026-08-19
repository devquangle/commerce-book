import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,

} from "lucide-react";
import { type VoucherResponse } from "../types/voucher.type";
import { VoucherActionMenu } from "./VoucherActionMenu";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { VoucherStatusBadge } from "./VoucherStatus";

interface VoucherMobileCardProps {
  voucher: VoucherResponse;
  onDelete: (voucher: VoucherResponse) => void;
  onEdit?: (voucher: VoucherResponse) => void;
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

export const VoucherMobileCard: React.FC<VoucherMobileCardProps> = ({
  voucher,
  onDelete,
  onEdit,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (vouch: VoucherResponse) => {
    if (onEdit) {
      onEdit(vouch);
    } else {
      navigate(`/shop/vouchers/edit/${vouch.id}`);
    }
  };

  const hasDetails = voucher.description || voucher.maxDiscount > 0 || voucher.startDate || voucher.endDate;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
      {/* Khúc trên: Ảnh + Tên + Mã */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-zinc-700 flex items-center justify-center">
          <Ticket size={24} className="text-slate-400 dark:text-zinc-500" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3
            className="font-semibold text-zinc-900 dark:text-white body-text leading-snug line-clamp-2"
            title={voucher.name}
          >
            {voucher.name}
          </h3>

          <span className="caption-text font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded w-fit border border-indigo-100 dark:border-indigo-500/20 block mt-0.5" title={voucher.code}>
            {voucher.code}
          </span>

          <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
            <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
              <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">Giảm giá:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{voucher.discountPercent}%</span>
            </div>

            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px]">Đơn tối thiểu:</span>
              <span>{formatMoney(voucher.minOrderValue)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px]">Lượt dùng:</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {voucher.usedCount} / {voucher.usageLimit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Khúc mở rộng (Xem thêm / Thu gọn) */}
      {hasDetails && showDetails && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2 animate-in fade-in duration-150">
          {voucher.description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{voucher.description}</p>
          )}

          <div className="flex flex-col gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {voucher.maxDiscount > 0 && (
              <span className="flex items-center gap-1.5">
                <DollarSign size={11} className="shrink-0" />
                Giảm tối đa: {formatMoney(voucher.maxDiscount)}
              </span>
            )}
            {voucher.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} className="shrink-0" />
                Từ: {formatDate(voucher.startDate)}
              </span>
            )}
            {voucher.endDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} className="shrink-0" />
                Đến: {formatDate(voucher.endDate)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dòng dưới: Trạng thái + Nút xem thêm + Menu thao tác */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-2.5 mt-0.5">
        <div className="flex items-center gap-2">
          <VoucherStatusBadge status={voucher.status} />

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

        <VoucherActionMenu
          item={voucher}
          onDelete={() => onDelete(voucher)}
          onEdit={() => handleEdit(voucher)}
        />
      </div>
    </div>
  );
};
