import { useQuery } from "@tanstack/react-query";
import WikipediaService from "../services/wikipedia.service";

export const useWikipedia = (name: string, enabledFetch: boolean = true) => {

  return useQuery({
    queryKey: ["wiki-author", name],
    queryFn: () => WikipediaService.fetchAuthorData(name),
    enabled: typeof name === "string" && name.length > 0 && enabledFetch,
    retry: 1, 
  });
};