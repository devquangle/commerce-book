import { useGenresWithBookCount } from '@/modules/admin/genres/hooks/useGenre';
import { useAuthorsWithBookCount } from '@/modules/admin/authors/hooks/useAuthor';
import { usePublishersWithBookCount } from '@/modules/admin/publishers/hooks/usePublisher';
import { useSeriesWithBookCount } from '@/modules/admin/series/hooks/useSeries';

export const useSearchProduct = () => {
  const { data: genres, isLoading: isLoadingGenres } = useGenresWithBookCount();
  const { data: authors, isLoading: isLoadingAuthors } = useAuthorsWithBookCount();
  const { data: publishers, isLoading: isLoadingPublishers } = usePublishersWithBookCount();
  const { data: series, isLoading: isLoadingSeries } = useSeriesWithBookCount();

  return {
    genres,
    authors,
    publishers,
    series,
    isLoading: isLoadingGenres || isLoadingAuthors || isLoadingPublishers || isLoadingSeries,
  };
};
