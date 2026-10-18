import { useQuery } from "@tanstack/react-query";
import { questionSetsApi } from "../api/question-sets.api";
import { questionSetKeys } from "../api/question-sets.keys";

export function useQuestionSetQuery(
  id?: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: id ? questionSetKeys.detail(id) : ["question-sets", "detail", "empty"],
    queryFn: ({ signal }) => {
      if (!id) {
        throw new Error("id is required to fetch question set details");
      }
      return questionSetsApi.getQuestionSet(id, signal);
    },
    enabled: Boolean(id) && (options?.enabled ?? true),
    staleTime: 30 * 1000,
    // Poll every 3 seconds while question generation is processing
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.status === "generating") {
        return 3000;
      }
      return false;
    },
  });
}
