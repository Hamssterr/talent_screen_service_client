"use client";

import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications.api";
import { applicationKeys } from "../api/applications.keys";
import { Application } from "../types/application.types";

export function useApplicationQuery(id?: string | null, enabled = true) {
  return useQuery<Application, Error>({
    queryKey: applicationKeys.detail(id || ""),
    queryFn: () => {
      if (!id) throw new Error("Application ID is required.");
      return applicationsApi.getApplication(id);
    },
    enabled: Boolean(id && enabled),
    staleTime: 60 * 1000,
  });
}
