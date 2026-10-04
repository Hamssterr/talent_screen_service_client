import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";
import { applicationKeys } from "@/features/applications/api/applications.keys";

export interface DeleteCvVersionVariables {
  id: string;
  applicationId: string;
}

export function useDeleteCvVersionMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, DeleteCvVersionVariables>({
    mutationFn: ({ id }) => {
      return cvApi.deleteCvVersion(id);
    },
    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: cvKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: cvKeys.list(variables.applicationId),
      });
      queryClient.invalidateQueries({
        queryKey: cvKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(variables.applicationId),
      });
      queryClient.invalidateQueries({
        queryKey: applicationKeys.lists(),
      });
    },
  });
}
