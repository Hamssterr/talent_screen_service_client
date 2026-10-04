export const candidateKeys = {
  all: ["candidates"] as const,
  lists: () => [...candidateKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) => [...candidateKeys.lists(), params] as const,
  searches: () => [...candidateKeys.all, "search"] as const,
  search: (params: { search?: string; page?: number; limit?: number }) =>
    [...candidateKeys.searches(), params] as const,
  details: () => [...candidateKeys.all, "detail"] as const,
  detail: (id: string) => [...candidateKeys.details(), id] as const,
};
