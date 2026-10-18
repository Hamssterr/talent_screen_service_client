import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";
import { QuestionSetDetail, ApproveQuestionSetInput } from "../types/question-set.types";

interface ApproveQuestionSetVariables {
  id: string;
  data: ApproveQuestionSetInput;
}

export function useApproveQuestionSetMutation() {
  const queryClient = useQueryClient();

  return useMutation<QuestionSetDetail, Error, ApproveQuestionSetVariables>({
    mutationFn: ({ id, data }) => questionSetsApi.approve(id, data),
    onSuccess: (approvedSet) => {
      queryClient.setQueryData(questionSetKeys.detail(approvedSet.id), approvedSet);
      queryClient.invalidateQueries({
        queryKey: questionSetKeys.lists(),
      });
    },
  });
}
