import React from "react";
import {
  Calendar,
  Megaphone,
} from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { Tooltip } from "@/components/common/Tooltip";
import { EmptyState } from "@/components/common/EmptyState";
import { type PromotionResponse } from "../types/promotion.type";
import { PromotionActionMenu } from "./PromotionActionMenu";
import { useNavigate } from "react-router-dom";
import { PromotionStatusBadge } from "./PromotionStatus";
import { PromotionTypeBadge } from "./PromotionTypeBadge";

export interface PromotionTableProps {
  promotions: PromotionResponse[];
  page?: number;
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit?: (promotion: PromotionResponse) => void;
  onDelete?: (promotion: PromotionResponse) => void;
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

export const PromotionTable: React.FC<PromotionTableProps> = ({
  promotions,
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

  const handleEdit = (promotion: PromotionResponse) => {
    if (onEdit) {
      onEdit(promotion);
    } else {
      navigate(`/shop/promotions/edit/${promotion.id}`);
    }
  };

  const handleDelete = (promotion: PromotionResponse) => {
    if (onDelete) {
      onDelete(promotion);
    }
  };

  return (
    <div className="hidden md:flex card-custom flex-col">
      <div className="overflow-x-auto overflow-hidden rounded-t-2xl">
        <table className="w-full text-left body-text text-zinc-600 dark:text-zinc-300">
          <thead className="bg-zinc-50 dark:bg-zinc-800/40 body-text uppercase font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider">
            <tr>
              <th className="px-4 py-4 w-14 text-center">STT</th>
              <th className="px-6 py-4 w-[35%]">Tên chương trình</th>
              <th className="px-6 py-4 w-[20%]">Loại</th>
              <th className="px-6 py-4 w-[20%]">Thời gian áp dụng</th>
              <th className="px-6 py-4 w-[15%]">Trạng thái</th>
              <th className="px-6 py-4 text-right w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {promotions.map((promotion, index) => {
              const stt = (activePage - 1) * pageSize + index + 1;

              return (
                <tr
                  key={
                    promotion.id
                      ? `promotion-${promotion.id}-${index}`
                      : index
                  }
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="px-4 py-4 text-center font-medium text-zinc-400 dark:text-zinc-500 body-text align-middle">
                    {stt}
                  </td>

                  <td className="py-3 px-6 align-middle">
                    <div className="flex gap-3 items-start">
                      <div className="relative shrink-0 overflow-hidden w-10 h-10 rounded-xl border border-dashed border-slate-200/80 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shadow-xs mt-0.5">
                        <Megaphone
                          size={18}
                          className="text-slate-400 dark:text-zinc-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center h-10">
                        <p
                          className="font-semibold text-zinc-900 dark:text-zinc-100 body-text leading-snug line-clamp-2"
                          title={promotion.name}
                        >
                          {promotion.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-6 align-middle">
                    <PromotionTypeBadge type={promotion.promotionCampaignType} />
                  </td>

                  <td className="py-3 px-6 align-middle">
                    <div className="flex flex-col gap-0.5 text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="shrink-0" />
                        <span>Từ: {formatDate(promotion.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="shrink-0 " />
                        <span>Đến: {formatDate(promotion.endDate)}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-6 align-middle">
                    <PromotionStatusBadge status={promotion.status} />
                  </td>

                  <td className="py-3 px-6 text-right align-middle">
                    <PromotionActionMenu
                      item={promotion}
                      onDelete={() => handleDelete(promotion)}
                      onEdit={() => handleEdit(promotion)}
                    />
                  </td>
                </tr>
              );
            })}

            {promotions.length === 0 && (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState title="Không tìm thấy dữ liệu promotion" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {promotions.length > 0 && onPageChange && (
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
