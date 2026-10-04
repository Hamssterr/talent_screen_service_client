"use client";

import { useQuery } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidates.api";
import { candidateKeys } from "../api/candidates.keys";
import { Candidate } from "../types/candidate.types";

export function useCandidateQuery(id?: string | null, enabled = true) {
  return useQuery<Candidate, Error>({
    queryKey: candidateKeys.detail(id || ""),
    queryFn: () => {
      if (!id) throw new Error("Candidate ID is required.");
      return candidatesApi.getCandidate(id);
    },
    enabled: Boolean(id && enabled),
    staleTime: 60 * 1000,
  });
}
