import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { jobApi } from "../api/job.api";
import { jobKeys } from "../api/job.keys";
import { CreateJobInput, Job } from "../types/job.types";

/**
 * Mutation hook to create a new job.
 */
export const useCreateJobMutation = (
  options?: UseMutationOptions<Job, Error, CreateJobInput>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobInput) => jobApi.createJob(data),
    retry: false,
    ...options,
    onSuccess: (...args) => {
      const [newJob] = args;
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      // Seed detail cache with newly created job
      if (newJob?.id) {
        queryClient.setQueryData(jobKeys.detail(newJob.id), newJob);
      }
      toast.success("Tạo vị trí tuyển dụng mới thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể tạo vị trí tuyển dụng");
      options?.onError?.(...args);
    },
  });
};
