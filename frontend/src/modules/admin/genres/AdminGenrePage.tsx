import { useState } from "react";
import { GenreHeader } from "./components/GenreHeader";
import { GenreFilter } from "./components/GenreFilter";
import { GenreTable } from "./components/GenreTable";
import { GenreMobileCard } from "./components/GenreMobileCard";
import { GenreSkeleton, GenreMobileSkeleton } from "./components/GenreSkeleton";
import { GenreModal } from "./components/GenreModal";
import { GenreDeleteModal } from "./components/GenreDeleteModal";
import { useGenreFilter } from "./hooks/useGenreFilter";
import {
  useCreateGenre,
  useDeleteGenre,
  useFilterGenre,
  useUpdateGenre,
} from "./hooks/useGenre";
import type { GenreResponse, GenreRequest } from "./types/genre.type";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import type { UseFormSetError } from "react-hook-form";
import { showErrorToast } from "@/libs/utils/toastUtil";
import { mapServerErrors } from "@/libs/utils/mapServerErrors";

const AdminGenrePage = () => {
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
  } = useGenreFilter();

  const { data, isFetching } = useFilterGenre(filterParams);
  const genreList = data?.items || [];
  const totalElements = data?.totalItems || 0;

  const createMutation = useCreateGenre();
  const updateMutation = useUpdateGenre();
  const deleteMutation = useDeleteGenre();
  // TODO: const deleteMutation = useDeleteGenre();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponse | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddGenre = () => {
    setSelectedGenre(null);
    setIsModalOpen(true);
  };

  const handleEditGenre = (genre: GenreResponse) => {
    setSelectedGenre(genre);
    setIsModalOpen(true);
  };

  const handleDeleteGenre = (genre: GenreResponse) => {
    setSelectedGenre(genre);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteGenre = () => {
    if (selectedGenre !== null) {
      // TODO: Call API delete genre via mutation
      console.log("Xóa tác giả ID:", selectedGenre.id);
      deleteMutation.mutate(selectedGenre.id);
      setSelectedGenre(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveGenre = async (
    genreData: GenreRequest & { id?: number },
    setError: UseFormSetError<GenreRequest>
  ) => {
    try {
      if (genreData.id) {
        await updateMutation.mutateAsync({ id: genreData.id, req: genreData });
      } else {
        await createMutation.mutateAsync(genreData);
      }
      setSelectedGenre(null);
      setIsModalOpen(false);
    } catch (error: unknown) {
      mapServerErrors(error, setError, showErrorToast);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <GenreHeader onAddGenre={handleAddGenre} />

      <GenreFilter
        keyword={keyword}
        status={status}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilter}
      />

      {isFetching ? (
        <>
          <div className="hidden md:block">
            <GenreSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <GenreMobileSkeleton />
            <GenreMobileSkeleton />
            <GenreMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          <GenreTable
            genres={genreList}
            page={page}
            pageSize={size}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditGenre}
            onDelete={handleDeleteGenre}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {genreList.map((genre, index) => (
              <GenreMobileCard
                key={genre.id}
                index={index}
                page={page}
                pageSize={size}
                genre={genre}
                onEdit={handleEditGenre}
                onDelete={handleDeleteGenre}
              />
            ))}
            {genreList.length === 0 && (
              <div className="col-span-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <EmptyState title="Không tìm thấy tác giả phù hợp" />
              </div>
            )}
          </div>

          {genreList.length > 0 && (
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
        <GenreModal
          isOpen={isModalOpen}
          genre={selectedGenre}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveGenre}
        />
      )}

      <GenreDeleteModal
        isOpen={isDeleteModalOpen}
        genre={selectedGenre}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteGenre}
      />
    </div>
  );
};

export default AdminGenrePage;
