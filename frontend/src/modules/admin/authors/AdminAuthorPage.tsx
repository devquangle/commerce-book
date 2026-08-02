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
import { useAuthorFilter } from "./hooks/useAuthorFilter";
import { useFilterAuthor } from "./hooks/useAuthor";
import type { AuthorResponse, AuthorRequest } from "./types/author.type";
import { EmptyState } from "@/components/common/EmptyState";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorResponse | null>(
    null,
  );

  const handleAddAuthor = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  const handleEditAuthor = (author: AuthorResponse) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const handleDeleteAuthor = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tác giả này?")) {
      // TODO: Call API delete author
      console.log("Delete author id:", id);
    }
  };

  const handleSaveAuthor = (authorData: AuthorRequest & { id?: number }) => {
    if (authorData.id) {
      // TODO: Call API update author
      console.log("Update author:", authorData);
    } else {
      // TODO: Call API create author
      console.log("Create author:", authorData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
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
            {authorList.map((author) => (
              <AuthorMobileCard
                key={author.id}
                author={author}
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
    </div>
  );
};

export default AdminAuthorPage;
