"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications.api";
import { applicationKeys } from "../api/applications.keys";

export function useDeleteApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => applicationsApi.deleteApplication(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: applicationKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
