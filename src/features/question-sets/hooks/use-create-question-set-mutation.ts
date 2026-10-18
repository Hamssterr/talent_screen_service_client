import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";
import { CreateQuestionSetInput, QuestionSetDetail } from "../types/question-set.types";

interface CreateQuestionSetVariables {
  applicationId: string;
  data: CreateQuestionSetInput;
}

export function useCreateQuestionSetMutation() {
  const queryClient = useQueryClient();

  return useMutation<QuestionSetDetail, Error, CreateQuestionSetVariables>({
    mutationFn: async ({ applicationId, data }) => {
      const idempotencyKey = data.mode === "ai" ? crypto.randomUUID() : undefined;
      return questionSetsApi.createQuestionSet(applicationId, data, idempotencyKey);
    },
    onSuccess: (newSet, variables) => {
      queryClient.invalidateQueries({
        queryKey: questionSetKeys.list(variables.applicationId),
      });
      queryClient.setQueryData(questionSetKeys.detail(newSet.id), newSet);
    },
  });
}
