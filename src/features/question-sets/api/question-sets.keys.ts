import { ListQuestionSetsParams } from "../types/question-set.types";

export const questionSetKeys = {
  all: ["question-sets"] as const,
  lists: () => [...questionSetKeys.all, "list"] as const,
  list: (applicationId: string, params?: ListQuestionSetsParams) =>
    [...questionSetKeys.lists(), applicationId, params ?? {}] as const,
  details: () => [...questionSetKeys.all, "detail"] as const,
  detail: (id: string) => [...questionSetKeys.details(), id] as const,
};
