"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications.api";
import { applicationKeys } from "../api/applications.keys";
import { Application, UpdateApplicationInput } from "../types/application.types";

export function useUpdateApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation<Application, Error, { id: string; data: UpdateApplicationInput }>({
    mutationFn: ({ id, data }) => applicationsApi.updateApplication(id, data),
    onSuccess: (updatedApp) => {
      queryClient.setQueryData(applicationKeys.detail(updatedApp.id), updatedApp);
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["applications", "candidate", updatedApp.candidateId] });
    },
  });
}
