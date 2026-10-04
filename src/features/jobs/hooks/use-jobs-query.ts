import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { jobApi } from "../api/job.api";
import { jobKeys } from "../api/job.keys";
import { JobListParams, PaginatedJobsResult } from "../types/job.types";

/**
 * Query hook to fetch paginated jobs list with status and scope filtering.
 */
export const useJobsQuery = (
  params?: JobListParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedJobsResult,
      Error,
      PaginatedJobsResult,
      readonly unknown[]
    >,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: jobKeys.list(params),
    queryFn: () => jobApi.listJobs(params),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
};
