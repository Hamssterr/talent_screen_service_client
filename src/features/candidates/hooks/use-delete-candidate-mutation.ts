"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { candidatesApi } from "../api/candidates.api";
import { candidateKeys } from "../api/candidates.keys";

export function useDeleteCandidateMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => candidatesApi.deleteCandidate(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: candidateKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: candidateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: candidateKeys.searches() });
    },
  });
}
