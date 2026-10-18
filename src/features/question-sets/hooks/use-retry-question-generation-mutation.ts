import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";
import { QuestionSetDetail, RetryQuestionGenerationInput } from "../types/question-set.types";

interface RetryQuestionGenerationVariables {
  id: string;
  data: RetryQuestionGenerationInput;
}

export function useRetryQuestionGenerationMutation() {
  const queryClient = useQueryClient();

  return useMutation<QuestionSetDetail, Error, RetryQuestionGenerationVariables>({
    mutationFn: async ({ id, data }) => {
      const idempotencyKey = crypto.randomUUID();
      return questionSetsApi.retryGeneration(id, data, idempotencyKey);
    },
    onSuccess: (updatedSet) => {
      queryClient.setQueryData(questionSetKeys.detail(updatedSet.id), updatedSet);
      queryClient.invalidateQueries({
        queryKey: questionSetKeys.lists(),
      });
    },
  });
}
