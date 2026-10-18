import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";

interface DeleteQuestionSetVariables {
  id: string;
  applicationId: string;
}

export function useDeleteQuestionSetMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteQuestionSetVariables>({
    mutationFn: ({ id }) => questionSetsApi.delete(id),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: questionSetKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: questionSetKeys.list(variables.applicationId),
      });
    },
  });
}
