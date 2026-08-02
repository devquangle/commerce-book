import { useState } from "react";
import { AuthorHeader } from "./components/AuthorHeader";
import { AuthorFilter } from "./components/AuthorFilter";
import { AuthorTable } from "./components/AuthorTable";
import { AuthorMobileCard } from "./components/AuthorMobileCard";
import {
  AuthorSkeleton,
  AuthorMobileSkeleton,
} from "./components/AuthorSkeleton";
import { AuthorModal } from "./components/AuthorModal";
import { AuthorDeleteModal } from "./components/AuthorDeleteModal";
import { useAuthorFilter } from "./hooks/useAuthorFilter";
import {
  useCreateAuthor,
  useDeleteAuthor,
  useFilterAuthor,
  useUpdateAuthor,
} from "./hooks/useAuthor";
import type { AuthorResponse, AuthorRequest } from "./types/author.type";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";
import type { UseFormSetError } from "react-hook-form";

const AdminAuthorPage = () => {
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
  } = useAuthorFilter();

  const { data, isFetching } = useFilterAuthor(filterParams);
  const authorList = data?.items || [];
  const totalElements = data?.totalItems || 0;

  const createMutation = useCreateAuthor();
  const updateMutation = useUpdateAuthor();
  const deleteMutation = useDeleteAuthor();
  // TODO: const deleteMutation = useDeleteAuthor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorResponse | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddAuthor = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  const handleEditAuthor = (author: AuthorResponse) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleDeleteAuthor = (author: AuthorResponse) => {
    setSelectedAuthor(author);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAuthor = () => {
    if (selectedAuthor !== null) {
      // TODO: Call API delete author via mutation
      console.log("Xóa tác giả ID:", selectedAuthor.id);
      deleteMutation.mutate(selectedAuthor.id);
      setSelectedAuthor(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveAuthor = async (
    authorData: AuthorRequest & { id?: number },
    setError: UseFormSetError<AuthorRequest>,
  ) => {
    try {
      if (authorData.id) {
        await updateMutation.mutateAsync({
          id: authorData.id,
          req: authorData,
        });
      } else {
        await createMutation.mutateAsync(authorData);
      }
      setSelectedAuthor(null);
      setIsModalOpen(false);
    } catch (error) {
      mapServerErrors(error, setError);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      <AuthorHeader onAddAuthor={handleAddAuthor} />

      <AuthorFilter
        keyword={keyword}
        status={status}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilter}
      />

      {isFetching ? (
        <>
          <div className="hidden md:block">
            <AuthorSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <AuthorMobileSkeleton />
            <AuthorMobileSkeleton />
            <AuthorMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          <AuthorTable
            authors={authorList}
            page={page}
            pageSize={size}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditAuthor}
            onDelete={handleDeleteAuthor}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {authorList.map((author, index) => (
              <AuthorMobileCard
                key={author.id}
                author={author}
                index={index}
                page={page}
                pageSize={size}
                onEdit={handleEditAuthor}
                onDelete={handleDeleteAuthor}
              />
            ))}
            {authorList.length === 0 && (
              <div className="col-span-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <EmptyState title="Không tìm thấy tác giả phù hợp" />
              </div>
            )}
          </div>

          {authorList.length > 0 && (
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
        <AuthorModal
          isOpen={isModalOpen}
          author={selectedAuthor}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveAuthor}
        />
      )}

      <AuthorDeleteModal
        isOpen={isDeleteModalOpen}
        author={selectedAuthor}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAuthor}
      />
    </div>
  );
};

export default AdminAuthorPage;
