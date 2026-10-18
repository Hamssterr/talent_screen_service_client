import { useQuery } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";
import { ListQuestionSetsParams } from "../types/question-set.types";

export function useQuestionSetsQuery(
  applicationId: string,
  params?: ListQuestionSetsParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: questionSetKeys.list(applicationId, params),
    queryFn: ({ signal }) => questionSetsApi.listByApplication(applicationId, params, signal),
    enabled: Boolean(applicationId) && (options?.enabled ?? true),
  });
}
