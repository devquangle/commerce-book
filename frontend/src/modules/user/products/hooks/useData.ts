import { useGenresWithProducts } from '@/modules/admin/genres/hooks/useGenre';
import { useAuthorsWithProducts } from '@/modules/admin/authors/hooks/useAuthor';
import { usePublishersWithProducts } from '@/modules/admin/publishers/hooks/usePublisher';
import { useSeriesWithProducts } from '@/modules/admin/series/hooks/useSeries';

export const useData = () => {
  const { data: genres, isLoading: isLoadingGenres } = useGenresWithProducts();
  const { data: authors, isLoading: isLoadingAuthors } = useAuthorsWithProducts();
  const { data: publishers, isLoading: isLoadingPublishers } = usePublishersWithProducts();
  const { data: series, isLoading: isLoadingSeries } = useSeriesWithProducts();

  return {
    genres,
    authors,
    publishers,
    series,
    isLoading: isLoadingGenres || isLoadingAuthors || isLoadingPublishers || isLoadingSeries,
  };
};
