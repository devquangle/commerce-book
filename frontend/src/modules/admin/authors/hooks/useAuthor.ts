import type { Pagination } from "@/libs/utils/pagination";
import type { AuthorFilterRequest, AuthorResponse } from "../types/author.type";
import { useQuery } from "@tanstack/react-query";
import AuthorService from "../services/author.service";


export const useFilterAuthor = (options?: AuthorFilterRequest) => {
  return useQuery<Pagination<AuthorResponse>>({
    queryKey: ["authors-filter", options],
    queryFn: () => AuthorService.search(options),
  });
};