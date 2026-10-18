import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";
import { QuestionSetDetail, UpdateQuestionSetItemsInput } from "../types/question-set.types";

interface UpdateQuestionSetItemsVariables {
  id: string;
  data: UpdateQuestionSetItemsInput;
}

export function useUpdateQuestionSetItemsMutation() {
  const queryClient = useQueryClient();

  return useMutation<QuestionSetDetail, Error, UpdateQuestionSetItemsVariables>({
    mutationFn: ({ id, data }) => questionSetsApi.updateItems(id, data),
    onSuccess: (updatedSet) => {
      queryClient.setQueryData(questionSetKeys.detail(updatedSet.id), updatedSet);
      queryClient.invalidateQueries({
        queryKey: questionSetKeys.lists(),
      });
    },
  });
}
