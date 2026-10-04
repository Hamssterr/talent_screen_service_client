"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidates.api";
import { candidateKeys } from "../api/candidates.keys";
import { Candidate, CreateCandidateInput } from "../types/candidate.types";

export function useCreateCandidateMutation() {
  const queryClient = useQueryClient();

  return useMutation<Candidate, Error, CreateCandidateInput>({
    mutationFn: (data) => candidatesApi.createCandidate(data),
    onSuccess: (newCandidate) => {
      // Seed detail cache
      queryClient.setQueryData(candidateKeys.detail(newCandidate.id), newCandidate);
      // Invalidate list queries and search queries
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: candidateKeys.searches() });
    },
  });
}
