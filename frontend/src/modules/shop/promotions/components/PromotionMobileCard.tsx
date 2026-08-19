import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,

} from "lucide-react";
import { type PromotionResponse } from "../types/promotion.type";
import { PromotionActionMenu } from "./PromotionActionMenu";
import { formatMoney } from "@/libs/utils/formatMoney.utils";
import { PromotionStatusBadge } from "./PromotionStatus";

interface PromotionMobileCardProps {
  promotion: PromotionResponse;
  onDelete: (promotion: PromotionResponse) => void;
  onEdit?: (promotion: PromotionResponse) => void;
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

export const PromotionMobileCard: React.FC<PromotionMobileCardProps> = ({
  promotion,
  onDelete,
  onEdit,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (vouch: PromotionResponse) => {
    if (onEdit) {
      onEdit(vouch);
    } else {
      navigate(`/shop/promotions/edit/${vouch.id}`);
    }
  };

  const hasDetails = promotion.description || promotion.maxDiscount > 0 || promotion.startDate || promotion.endDate;

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
            title={promotion.name}
          >
            {promotion.name}
          </h3>

          <span className="caption-text font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded w-fit border border-indigo-100 dark:border-indigo-500/20 block mt-0.5" title={promotion.code}>
            {promotion.code}
          </span>

          <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
            <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
              <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">Giảm giá:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{promotion.discountPercent}%</span>
            </div>

            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px]">Đơn tối thiểu:</span>
              <span>{formatMoney(promotion.minOrderValue)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
              <span className="text-[11px]">Lượt dùng:</span>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {promotion.usedCount} / {promotion.usageLimit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Khúc mở rộng (Xem thêm / Thu gọn) */}
      {hasDetails && showDetails && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-2 animate-in fade-in duration-150">
          {promotion.description && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{promotion.description}</p>
          )}

          <div className="flex flex-col gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {promotion.maxDiscount > 0 && (
              <span className="flex items-center gap-1.5">
                <DollarSign size={11} className="shrink-0" />
                Giảm tối đa: {formatMoney(promotion.maxDiscount)}
              </span>
            )}
            {promotion.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} className="shrink-0" />
                Từ: {formatDate(promotion.startDate)}
              </span>
            )}
            {promotion.endDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={11} className="shrink-0" />
                Đến: {formatDate(promotion.endDate)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Dòng dưới: Trạng thái + Nút xem thêm + Menu thao tác */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-2.5 mt-0.5">
        <div className="flex items-center gap-2">
          <PromotionStatusBadge status={promotion.status} />

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

        <PromotionActionMenu
          item={promotion}
          onDelete={() => onDelete(promotion)}
          onEdit={() => handleEdit(promotion)}
        />
      </div>
    </div>
  );
};
