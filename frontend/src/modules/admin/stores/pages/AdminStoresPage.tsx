import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { StoreHeader } from "@/components/stores/StoreHeader";
import { StoreFilter } from "@/components/stores/StoreFilter";
import { StoreTable } from "@/components/stores/StoreTable";
import { StoreMobileCard } from "@/components/stores/StoreMobileCard";
import { StoreSkeleton, StoreMobileSkeleton } from "@/components/stores/StoreSkeleton";
import { StoreDetailModal } from "@/components/stores/StoreDetailModal";
import { StoreApproveModal } from "@/components/stores/StoreApproveModal";
import { StoreRejectModal } from "@/components/stores/StoreRejectModal";
import { useAdminStoreFilter } from "../hooks/useAdminStoreFilter";
import {
  useSearchShopsForAdmin,
  useShopDetailForAdmin,
} from "../hooks/useAdminStore";
import type { AdminShopResponse, AdminShopDetailResponse } from "../types/store.type";

export const AdminStoresPage = () => {
  const {
    keyword,
    status,
    page,
    size,
    filterParams,
    handleKeywordChange,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleResetFilter,
  } = useAdminStoreFilter();

  const { data, isLoading } = useSearchShopsForAdmin(filterParams);
  const stores = data?.items || [];
  const totalElements = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  // Modals state
  const [detailStoreId, setDetailStoreId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [approveItem, setApproveItem] = useState<
    AdminShopResponse | AdminShopDetailResponse | null
  >(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const [rejectItem, setRejectItem] = useState<
    AdminShopResponse | AdminShopDetailResponse | null
  >(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Fetch detail query when detailStoreId is selected
  const { data: storeDetail, isLoading: isDetailLoading } =
    useShopDetailForAdmin(detailStoreId);

  // Actions
  const handleViewDetail = (id: number) => {
    setDetailStoreId(id);
    setIsDetailOpen(true);
  };

  const handleOpenApprove = (
    item: AdminShopResponse | AdminShopDetailResponse,
  ) => {
    setApproveItem(item);
    setIsApproveOpen(true);
  };

  const handleOpenReject = (
    item: AdminShopResponse | AdminShopDetailResponse,
  ) => {
    setRejectItem(item);
    setIsRejectOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      {/* Header */}
      <StoreHeader />

      {/* Filter */}
      <StoreFilter
        keyword={keyword}
        status={status}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilter}
      />

      {isLoading ? (
        <>
          <div className="hidden md:block">
            <StoreSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <StoreMobileSkeleton />
            <StoreMobileSkeleton />
            <StoreMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          {/* Giao diện Table cho Desktop */}
          <div className="hidden md:block">
            <StoreTable
              stores={stores}
              page={page}
              pageSize={size}
              totalElements={totalElements}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onView={handleViewDetail}
              onApprove={handleOpenApprove}
              onReject={handleOpenReject}
            />
          </div>

          {/* Giao diện Card cho Mobile/Tablet */}
          <div className="flex flex-col gap-4 md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stores.map((store) => (
                <StoreMobileCard
                  key={store.id}
                  store={store}
                  onView={handleViewDetail}
                  onApprove={handleOpenApprove}
                  onReject={handleOpenReject}
                />
              ))}
              {stores.length === 0 && (
                <div className="col-span-full py-24 text-center text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  Không tìm thấy gian hàng nào
                </div>
              )}
            </div>

            {stores.length > 0 && (
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

      {/* Modal Chi tiết hồ sơ eKYC & Gian hàng */}
      <StoreDetailModal
        isOpen={isDetailOpen}
        store={storeDetail || null}
        isLoading={isDetailLoading}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailStoreId(null);
        }}
        onApprove={(store) => handleOpenApprove(store)}
        onReject={(store) => handleOpenReject(store)}
      />

      {/* Modal Phê duyệt */}
      <StoreApproveModal
        isOpen={isApproveOpen}
        item={approveItem}
        onClose={() => {
          setIsApproveOpen(false);
          setApproveItem(null);
        }}
      />

      {/* Modal Từ chối */}
      <StoreRejectModal
        isOpen={isRejectOpen}
        item={rejectItem}
        onClose={() => {
          setIsRejectOpen(false);
          setRejectItem(null);
        }}
      />
    </div>
  );
};

export default AdminStoresPage;
