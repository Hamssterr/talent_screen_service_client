import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { jobApi } from "../api/job.api";
import { jobKeys } from "../api/job.keys";

/**
 * Mutation hook to soft delete a job (Admin only with jobs:manage permission).
 */
export const useDeleteJobMutation = (
  options?: UseMutationOptions<{ message: string }, Error, string>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobApi.deleteJob(id),
    retry: false,
    ...options,
    onSuccess: (...args) => {
      const [, id] = args;
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      if (id) {
        queryClient.removeQueries({ queryKey: jobKeys.detail(id) });
      }
      toast.success("Đã xóa vị trí tuyển dụng thành công");
      options?.onSuccess?.(...args);
    },
    onError: (...args) => {
      const [error] = args;
      toast.error(error.message || "Không thể xóa vị trí tuyển dụng");
      options?.onError?.(...args);
    },
  });
};
