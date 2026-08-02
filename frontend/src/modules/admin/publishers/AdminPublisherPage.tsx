import { useState } from "react";
import { PublisherHeader } from "./components/PublisherHeader";
import { PublisherFilter } from "./components/PublisherFilter";
import { PublisherTable } from "./components/PublisherTable";
import { PublisherMobileCard } from "./components/PublisherMobileCard";
import {
  PublisherSkeleton,
  PublisherMobileSkeleton,
} from "./components/PublisherSkeleton";
import { PublisherModal } from "./components/PublisherModal";
import { PublisherDeleteModal } from "./components/PublisherDeleteModal";
import { usePublisherFilter } from "./hooks/usePublisherFilter";
import {
  useCreatePublisher,
  useDeletePublisher,
  useFilterPublisher,
  useUpdatePublisher,
} from "./hooks/usePublisher";
import type {
  PublisherResponse,
  PublisherRequest,
} from "./types/publisher.type";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import type { UseFormSetError } from "react-hook-form";

const AdminPublisherPage = () => {
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
  } = usePublisherFilter();

  const { data, isFetching } = useFilterPublisher(filterParams);
  const publisherList = data?.items || [];
  const totalElements = data?.totalItems || 0;

  const createMutation = useCreatePublisher();
  const updateMutation = useUpdatePublisher();
  const deleteMutation = useDeletePublisher();
  // TODO: const deleteMutation = useDeletePublisher();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] =
    useState<PublisherResponse | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddPublisher = () => {
    setSelectedPublisher(null);
    setIsModalOpen(true);
  };

  const handleEditPublisher = (publisher: PublisherResponse) => {
    setSelectedPublisher(publisher);
    setIsModalOpen(true);
  };

  const handleDeletePublisher = (publisher: PublisherResponse) => {
    setSelectedPublisher(publisher);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePublisher = () => {
    if (selectedPublisher !== null) {
      // TODO: Call API delete publisher via mutation
      console.log("Xóa tác giả ID:", selectedPublisher.id);
      deleteMutation.mutate(selectedPublisher.id);
      setSelectedPublisher(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSavePublisher = async (
    publisherData: PublisherRequest & { id?: number },
    setError: UseFormSetError<PublisherRequest>,
  ) => {
    try {
      if (publisherData.id) {
        await updateMutation.mutateAsync({ id: publisherData.id, req: publisherData });
      } else {
        await createMutation.mutateAsync(publisherData);
      }
      setSelectedPublisher(null);
      setIsModalOpen(false);
    } catch (error: unknown) {
      mapServerErrors(error, setError);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <PublisherHeader onAddPublisher={handleAddPublisher} />

      <PublisherFilter
        keyword={keyword}
        status={status}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilter}
      />

      {isFetching ? (
        <>
          <div className="hidden md:block">
            <PublisherSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <PublisherMobileSkeleton />
            <PublisherMobileSkeleton />
            <PublisherMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          <PublisherTable
            publishers={publisherList}
            page={page}
            pageSize={size}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditPublisher}
            onDelete={handleDeletePublisher}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {publisherList.map((publisher, index) => (
              <PublisherMobileCard
                key={publisher.id}
                publisher={publisher}
                index={index}
                page={page}
                pageSize={size}
                onEdit={handleEditPublisher}
                onDelete={handleDeletePublisher}
              />
            ))}
            {publisherList.length === 0 && (
              <div className="col-span-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <EmptyState title="Không tìm thấy tác giả phù hợp" />
              </div>
            )}
          </div>

          {publisherList.length > 0 && (
            <div className="md:hidden w-full card-custom p-3">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(totalElements / size)}
                totalElements={totalElements}
                pageSize={size}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <PublisherModal
          isOpen={isModalOpen}
          publisher={selectedPublisher}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePublisher}
        />
      )}

      <PublisherDeleteModal
        isOpen={isDeleteModalOpen}
        publisher={selectedPublisher}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeletePublisher}
      />
    </div>
  );
};

export default AdminPublisherPage;
