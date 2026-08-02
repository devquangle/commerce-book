import { useState } from "react";
import { SeriesHeader } from "./components/SeriesHeader";
import { SeriesFilter } from "./components/SeriesFilter";
import { SeriesTable } from "./components/SeriesTable";
import { SeriesMobileCard } from "./components/SeriesMobileCard";
import {
  SeriesSkeleton,
  SeriesMobileSkeleton,
} from "./components/SeriesSkeleton";
import { SeriesModal } from "./components/SeriesModal";
import { SeriesDeleteModal } from "./components/SeriesDeleteModal";
import { useSeriesFilter } from "./hooks/useSeriesFilter";
import {
  useCreateSeries,
  useDeleteSeries,
  useFilterSeries,
  useUpdateSeries,
} from "./hooks/useSeries";
import type { SeriesResponse, SeriesRequest } from "./types/series.type";
import { EmptyState } from "@/components/common/EmptyState";

const AdminSeriesPage = () => {
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
  } = useSeriesFilter();

  const { data, isFetching } = useFilterSeries(filterParams);
  const seriesList = data?.items || [];
  const totalElements = data?.totalItems || 0;

  const createMutation = useCreateSeries();
  const updateMutation = useUpdateSeries();
  const deleteMutation = useDeleteSeries();
  // TODO: const deleteMutation = useDeleteSeries();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<SeriesResponse | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAddSeries = () => {
    setSelectedSeries(null);
    setIsModalOpen(true);
  };

  const handleEditSeries = (series: SeriesResponse) => {
    setSelectedSeries(series);
    setIsModalOpen(true);
  };

  const handleDeleteSeries = (series: SeriesResponse) => {
    setSelectedSeries(series);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteSeries = () => {
    if (selectedSeries !== null) {
      // TODO: Call API delete series via mutation
      console.log("Xóa tác giả ID:", selectedSeries.id);
      deleteMutation.mutate(selectedSeries.id);
      setSelectedSeries(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveSeries = (seriesData: SeriesRequest & { id?: number }) => {
    if (seriesData.id) {
      updateMutation.mutate({ id: seriesData.id, req: seriesData });
    } else {
      createMutation.mutate(seriesData);
    }
    setSelectedSeries(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-full pb-6">
      <SeriesHeader onAddSeries={handleAddSeries} />

      <SeriesFilter
        keyword={keyword}
        status={status}
        onKeywordChange={handleKeywordChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilter}
      />

      {isFetching ? (
        <>
          <div className="hidden md:block">
            <SeriesSkeleton />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            <SeriesMobileSkeleton />
            <SeriesMobileSkeleton />
            <SeriesMobileSkeleton />
          </div>
        </>
      ) : (
        <>
          <SeriesTable
            series={seriesList}
            page={page}
            pageSize={size}
            totalElements={totalElements}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onEdit={handleEditSeries}
            onDelete={handleDeleteSeries}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {seriesList.map((series,index) => (
              <SeriesMobileCard
                index={index}
                page={page}
                pageSize={size}
                key={series.id}
                series={series}
                onEdit={handleEditSeries}
                onDelete={handleDeleteSeries}
              />
            ))}
            {seriesList.length === 0 && (
              <div className="col-span-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <EmptyState title="Không tìm thấy tác giả phù hợp" />
              </div>
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <SeriesModal
          isOpen={isModalOpen}
          series={selectedSeries}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSeries}
        />
      )}

      <SeriesDeleteModal
        isOpen={isDeleteModalOpen}
        series={selectedSeries}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSeries}
      />
    </div>
  );
};

export default AdminSeriesPage;
