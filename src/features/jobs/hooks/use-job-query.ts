import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { jobApi } from "../api/job.api";
import { jobKeys } from "../api/job.keys";
import { Job } from "../types/job.types";

/**
 * Query hook to fetch detailed information of a specific job by UUID.
 */
export const useJobQuery = (
  id: string,
  options?: Omit<
    UseQueryOptions<Job, Error, Job, readonly unknown[]>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobApi.getJob(id),
    enabled: Boolean(id) && (options?.enabled !== undefined ? options.enabled : true),
    staleTime: 60 * 1000,
    retry: false,
    ...options,
  });
};
