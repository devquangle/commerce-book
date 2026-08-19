import { Pagination } from "@/components/common/Pagination";
import { useState } from "react";
import { VoucherHeader } from "../components/VoucherHeader";
import { VoucherFilter } from "../components/VoucherFilter";
import { VoucherTable } from "../components/VoucherTable";
import { VoucherMobileCard } from "../components/VoucherMobileCard";
import {
  VoucherSkeleton,
  VoucherMobileSkeleton,
} from "../components/VoucherSkeleton";
import { VoucherDeleteModal } from "../components/VoucherDeleteModal";
import { useVoucherShopFilter } from "../hooks/useVoucherShopFilter";
import { useVoucherShop, useDeleteVoucherShop } from "../hooks/useVoucher";
import type { VoucherResponse } from "../types/voucher.type";

const ShopVoucherListPage = () => {
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
  } = useVoucherShopFilter();

  const { data, isLoading } = useVoucherShop(filterParams);
  const deleteVoucherMutation = useDeleteVoucherShop();

  const vouchers = data?.items || [];
  const totalElements = data?.totalItems || 0;

  // Trạng thái cho Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState<VoucherResponse | null>(null);

  const handleDeleteClick = (voucher: VoucherResponse) => {
    setVoucherToDelete(voucher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const id = voucherToDelete?.id;
    if (!id) return;

    deleteVoucherMutation.mutate(id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setVoucherToDelete(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <VoucherHeader />
      <VoucherFilter
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
            <VoucherSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <VoucherMobileSkeleton />
            <VoucherMobileSkeleton />
            <VoucherMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Giao diện Table cho Desktop */}
          <div className="hidden md:block">
            <VoucherTable
              vouchers={vouchers}
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
              {vouchers.map((voucher, index) => (
                <VoucherMobileCard
                  key={
                    voucher.id
                      ? `voucher-mobile-${voucher.id}-${index}`
                      : index
                  }
                  voucher={voucher}
                  onDelete={handleDeleteClick}
                />
              ))}
              {vouchers.length === 0 && (
                <div className="col-span-full py-24 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  Không tìm thấy voucher nào
                </div>
              )}
            </div>

            {vouchers.length > 0 && (
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
      <VoucherDeleteModal
        isOpen={isDeleteModalOpen}
        item={voucherToDelete}
        isDeleting={deleteVoucherMutation.isPending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ShopVoucherListPage;
