import AuthorService from "@/modules/admin/authors/services/author.service";
import GenreService from "@/modules/admin/genres/services/genre.service";
import PublisherService from "@/modules/admin/publishers/services/publisher.service";
import SeriesService from "@/modules/admin/series/services/series.service";
import { useQueries } from "@tanstack/react-query";

export const useBookFormData = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["genres"],
        queryFn: () => GenreService.search(),
      },
      {
        queryKey: ["authors"],
        queryFn: () => AuthorService.search(),
      },
      {
        queryKey: ["publishers"],
        queryFn: () => PublisherService.search(),
      },
      {
        queryKey: ["series"],
        queryFn: () => SeriesService.search(),
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  const genresData = results[0].data;
  const authorsData = results[1].data;
  const publishersData = results[2].data;
  const seriesData = results[3].data;

  const genresDataOption =
    genresData?.items
      ?.filter((item) => item.status === "ACTIVE")
      .map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [];

  const authorsDataOption =
    authorsData?.items
      ?.filter((item) => item.status === "ACTIVE")
      .map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [];

  const publishersDataOption =
    publishersData?.items
      ?.filter((item) => item.status === "ACTIVE")
      .map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [];

  const seriesDataOption =
    seriesData?.items
      ?.filter((item) => item.status === "ACTIVE")
      .map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? [];

  return {
    genresData,
    authorsData,
    publishersData,
    seriesData,
    genresDataOption,
    authorsDataOption,
    publishersDataOption,
    seriesDataOption,
    isLoading,
    isError,
  };
};
