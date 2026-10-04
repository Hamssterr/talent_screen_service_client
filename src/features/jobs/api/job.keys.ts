import { JobListParams } from "../types/job.types";

export const jobKeys = {
  all: ["jobs"] as const,

  lists: () => [...jobKeys.all, "list"] as const,

  list: (params?: JobListParams) =>
    [
      ...jobKeys.lists(),
      {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        status: params?.status ?? "",
        scope: params?.scope ?? "all",
      },
    ] as const,

  details: () => [...jobKeys.all, "detail"] as const,

  detail: (id: string) => [...jobKeys.details(), id] as const,
};
