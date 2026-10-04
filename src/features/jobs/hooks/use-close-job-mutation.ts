import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { jobApi } from "../api/job.api";
import { jobKeys } from "../api/job.keys";
import { CloseJobInput, Job } from "../types/job.types";

/**
 * Mutation hook to close a job.
 */
export const useCloseJobMutation = (
  options?: UseMutationOptions<
    Job,
    Error,
    { id: string; data: CloseJobInput }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => jobApi.closeJob(id, data),
    retry: false,
    ...options,
    onSuccess: (...args) => {
      const [closedJob] = args;
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      if (closedJob?.id) {
        queryClient.setQueryData(jobKeys.detail(closedJob.id), closedJob);
      }
      toast.success("Đã đóng vị trí tuyển dụng thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      if (!error.message?.includes("Phiên bản dữ liệu không khớp") && !error.message?.includes("VERSION_CONFLICT")) {
        toast.error(error.message || "Không thể đóng vị trí tuyển dụng");
      }
      options?.onError?.(...args);
    },
  });
};
