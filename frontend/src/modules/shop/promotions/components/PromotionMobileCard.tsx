import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Megaphone,
} from "lucide-react";
import { type PromotionResponse } from "../types/promotion.type";
import { PromotionActionMenu } from "./PromotionActionMenu";
import { PromotionStatusBadge } from "./PromotionStatus";
import { PromotionTypeBadge } from "./PromotionTypeBadge";

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
  const navigate = useNavigate();

  const handleEdit = (vouch: PromotionResponse) => {
    if (onEdit) {
      onEdit(vouch);
    } else {
      navigate(`/shop/promotions/edit/${vouch.id}`);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
      {/* Thông tin chính */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-zinc-700 flex items-center justify-center">
          <Megaphone size={24} className="text-slate-400 dark:text-zinc-500" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h3
            className="font-semibold text-zinc-900 dark:text-white body-text leading-snug line-clamp-2"
            title={promotion.name}
          >
            {promotion.name}
          </h3>

          <PromotionTypeBadge type={promotion.promotionCampaignType} />

          <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400">
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
      </div>

      {/* Trạng thái + Thao tác */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-2.5 mt-0.5">
        <PromotionStatusBadge status={promotion.status} />

        <PromotionActionMenu
          item={promotion}
          onDelete={() => onDelete(promotion)}
          onEdit={() => handleEdit(promotion)}
        />
      </div>
    </div>
  );
};
