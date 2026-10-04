import { useQuery } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";

export function useCvVersionQuery(
  cvId?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: cvId ? cvKeys.detail(cvId) : ["cv", "detail", "empty"],
    queryFn: ({ signal }) => {
      if (!cvId) {
        throw new Error("cvId is required to fetch CV details");
      }
      return cvApi.getCvVersion(cvId, signal);
    },
    enabled: Boolean(cvId) && (options?.enabled ?? true),
    staleTime: 30 * 1000,
    // Poll gently only if currently processing in background
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.extractionStatus === "processing") {
        return 4000;
      }
      return false;
    },
  });
}
