import { useQuery } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";
import { ListCvVersionsParams } from "../types/cv.types";

export function useCvVersionsQuery(
  applicationId?: string,
  params?: ListCvVersionsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: applicationId ? cvKeys.list(applicationId, params) : ["cv", "list", "empty"],
    queryFn: ({ signal }) => {
      if (!applicationId) {
        throw new Error("applicationId is required to list CV versions");
      }
      return cvApi.listCvVersions(applicationId, params, signal);
    },
    enabled: Boolean(applicationId) && (options?.enabled ?? true),
    staleTime: 30 * 1000,
  });
}
