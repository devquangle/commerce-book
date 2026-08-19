import React from "react";
import { type PromotionCampaignType } from "../types/promotion.type";

interface PromotionTypeBadgeProps {
  type: PromotionCampaignType | string;
}

export const PromotionTypeBadge: React.FC<PromotionTypeBadgeProps> = ({ type }) => {
  let label = type;
  let bgClass = "bg-zinc-50 dark:bg-zinc-500/10";
  let textClass = "text-zinc-600 dark:text-zinc-400";
  let borderClass = "border-zinc-200 dark:border-zinc-500/20";

  switch (type) {
    case "FLASH_SALE":
      label = "Flash Sale";
      bgClass = "bg-rose-50 dark:bg-rose-500/10";
      textClass = "text-rose-600 dark:text-rose-400";
      borderClass = "border-rose-100 dark:border-rose-500/20";
      break;
    case "PRODUCT_DISCOUNT":
      label = "Giảm giá sản phẩm";
      bgClass = "bg-indigo-50 dark:bg-indigo-500/10";
      textClass = "text-indigo-600 dark:text-indigo-400";
      borderClass = "border-indigo-100 dark:border-indigo-500/20";
      break;
    case "SEASONAL":
      label = "Khuyến mãi theo mùa";
      bgClass = "bg-emerald-50 dark:bg-emerald-500/10";
      textClass = "text-emerald-600 dark:text-emerald-400";
      borderClass = "border-emerald-100 dark:border-emerald-500/20";
      break;
  }

  return (
    <span
      className={`text-[13px] font-medium px-2 py-0.5 rounded-md border ${bgClass} ${textClass} ${borderClass} inline-flex whitespace-nowrap`}
    >
      {label}
    </span>
  );
};
