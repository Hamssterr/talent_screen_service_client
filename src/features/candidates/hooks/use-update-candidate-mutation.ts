"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidates.api";
import { candidateKeys } from "../api/candidates.keys";
import { Candidate, UpdateCandidateInput } from "../types/candidate.types";

export function useUpdateCandidateMutation() {
  const queryClient = useQueryClient();

  return useMutation<Candidate, Error, { id: string; data: UpdateCandidateInput }>({
    mutationFn: ({ id, data }) => candidatesApi.updateCandidate(id, data),
    onSuccess: (updatedCandidate) => {
      queryClient.setQueryData(candidateKeys.detail(updatedCandidate.id), updatedCandidate);
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: candidateKeys.searches() });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
