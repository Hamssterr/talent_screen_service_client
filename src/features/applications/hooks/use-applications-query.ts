"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications.api";
import { applicationKeys } from "../api/applications.keys";
import { ListApplicationsParams, PaginatedApplicationsResult } from "../types/application.types";

export function useApplicationsQuery(params?: ListApplicationsParams) {
  return useQuery<PaginatedApplicationsResult, Error>({
    queryKey: applicationKeys.list(params as Record<string, unknown>),
    queryFn: ({ signal }) => applicationsApi.listApplications(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}
