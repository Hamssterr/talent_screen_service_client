import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { jobApi } from "../api/job.api";
import { jobKeys } from "../api/job.keys";
import { Job, UpdateJobInput } from "../types/job.types";

/**
 * Mutation hook to update an existing job with optimistic concurrency expectedVersion.
 */
export const useUpdateJobMutation = (
  options?: UseMutationOptions<
    Job,
    Error,
    { id: string; data: UpdateJobInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => jobApi.updateJob(id, data),
    retry: false,
    ...options,
    onSuccess: (...args) => {
      const [updatedJob] = args;
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      if (updatedJob?.id) {
        queryClient.setQueryData(jobKeys.detail(updatedJob.id), updatedJob);
      }
      toast.success("Cập nhật vị trí tuyển dụng thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      // Do not show generic toast if version conflict is handled specially in UI
      if (!error.message?.includes("Phiên bản dữ liệu không khớp") && !error.message?.includes("VERSION_CONFLICT")) {
        toast.error(error.message || "Không thể cập nhật vị trí tuyển dụng");
      }
      options?.onError?.(...args);
    },
  });
};
