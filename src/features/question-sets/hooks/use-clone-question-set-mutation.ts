import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";
import { QuestionSetDetail } from "../types/question-set.types";

export function useCloneQuestionSetMutation() {
  const queryClient = useQueryClient();

  return useMutation<QuestionSetDetail, Error, string>({
    mutationFn: (id: string) => questionSetsApi.clone(id),
    onSuccess: (clonedSet) => {
      queryClient.setQueryData(questionSetKeys.detail(clonedSet.id), clonedSet);
      queryClient.invalidateQueries({
        queryKey: questionSetKeys.lists(),
      });
    },
  });
}
