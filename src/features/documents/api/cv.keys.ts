import { ListCvVersionsParams } from "../types/cv.types";

export const cvKeys = {
  all: ["cv"] as const,
  lists: () => [...cvKeys.all, "list"] as const,
  list: (applicationId: string, params?: ListCvVersionsParams) =>
    [...cvKeys.lists(), applicationId, params] as const,
  details: () => [...cvKeys.all, "detail"] as const,
  detail: (cvId: string) => [...cvKeys.details(), cvId] as const,
};
