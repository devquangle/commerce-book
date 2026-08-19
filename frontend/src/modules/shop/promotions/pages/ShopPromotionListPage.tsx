import { Pagination } from "@/components/common/Pagination";
import { useState } from "react";
import { PromotionHeader } from "../components/PromotionHeader";
import { PromotionFilter } from "../components/PromotionFilter";
import { PromotionTable } from "../components/PromotionTable";
import { PromotionMobileCard } from "../components/PromotionMobileCard";
import {
  PromotionSkeleton,
  PromotionMobileSkeleton,
} from "../components/PromotionSkeleton";
import { PromotionDeleteModal } from "../components/PromotionDeleteModal";
import { usePromotionShopFilter } from "../hooks/usePromotionShopFilter";
import { usePromotionShop, useDeletePromotionShop } from "../hooks/usePromotion";
import type { PromotionResponse } from "../types/promotion.type";

const ShopPromotionListPage = () => {
  const {
    keyword,
    startDate,
    endDate,
    status,
    page,
    size,
    filterParams,
    handleKeywordChange,
    handleStartDateChange,
    handleEndDateChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter,
  } = usePromotionShopFilter();

  const { data, isLoading } = usePromotionShop(filterParams);
  const deletePromotionMutation = useDeletePromotionShop();

  const promotions = data?.items || [];
  const totalElements = data?.totalItems || 0;

  // Trạng thái cho Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<PromotionResponse | null>(null);

  const handleDeleteClick = (promotion: PromotionResponse) => {
    setPromotionToDelete(promotion);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const id = promotionToDelete?.id;
    if (!id) return;

    deletePromotionMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setPromotionToDelete(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <PromotionHeader />
      <PromotionFilter
        keyword={keyword}
        startDate={startDate}
        endDate={endDate}
        status={status}
        onKeywordChange={handleKeywordChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilter}
      />

      {isLoading ? (
        <>
          <div className="hidden md:block">
            <PromotionSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <PromotionMobileSkeleton />
            <PromotionMobileSkeleton />
            <PromotionMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Giao diện Table cho Desktop */}
          <div className="hidden md:block">
            <PromotionTable
              promotions={promotions}
              page={page}
              pageSize={size}
              totalElements={totalElements}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onDelete={handleDeleteClick}
            />
          </div>

          {/* Giao diện Card cho Mobile/Tablet */}
          <div className="flex flex-col gap-4 md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promotions.map((promotion, index) => (
                <PromotionMobileCard
                  key={
                    promotion.id
                      ? `promotion-mobile-${promotion.id}-${index}`
                      : index
                  }
                  promotion={promotion}
                  onDelete={handleDeleteClick}
                />
              ))}
              {promotions.length === 0 && (
                <div className="col-span-full py-24 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  Không tìm thấy promotion nào
                </div>
              )}
            </div>

            {promotions.length > 0 && (
              <div className="card-custom">
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(totalElements / size) || 1}
                  totalElements={totalElements}
                  pageSize={size}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal xác nhận xóa */}
      <PromotionDeleteModal
        isOpen={isDeleteModalOpen}
        item={promotionToDelete}
        isDeleting={deletePromotionMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ShopPromotionListPage;
