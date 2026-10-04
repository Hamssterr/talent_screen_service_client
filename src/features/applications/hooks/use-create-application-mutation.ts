"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications.api";
import { applicationKeys } from "../api/applications.keys";
import { Application, CreateApplicationInput } from "../types/application.types";

export function useCreateApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation<Application, Error, { data: CreateApplicationInput; idempotencyKey: string }>({
    mutationFn: ({ data, idempotencyKey }) =>
      applicationsApi.createApplication(data, idempotencyKey),
    onSuccess: (newApp) => {
      queryClient.setQueryData(applicationKeys.detail(newApp.id), newApp);
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["applications", "candidate", newApp.candidateId] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });
}
