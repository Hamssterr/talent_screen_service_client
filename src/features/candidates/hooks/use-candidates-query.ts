"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidates.api";
import { candidateKeys } from "../api/candidates.keys";
import { ListCandidatesParams, PaginatedCandidatesResult } from "../types/candidate.types";

export function useCandidatesQuery(params?: ListCandidatesParams) {
  return useQuery<PaginatedCandidatesResult, Error>({
    queryKey: candidateKeys.list(params as Record<string, unknown>),
    queryFn: ({ signal }) => candidatesApi.listCandidates(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}
