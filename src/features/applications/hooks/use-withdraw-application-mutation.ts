"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications.api";
import { applicationKeys } from "../api/applications.keys";
import { Application, WithdrawApplicationInput } from "../types/application.types";

export function useWithdrawApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation<Application, Error, { id: string; data: WithdrawApplicationInput }>({
    mutationFn: ({ id, data }) => applicationsApi.withdrawApplication(id, data),
    onSuccess: (withdrawnApp) => {
      queryClient.setQueryData(applicationKeys.detail(withdrawnApp.id), withdrawnApp);
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["applications", "candidate", withdrawnApp.candidateId] });
    },
  });
}
