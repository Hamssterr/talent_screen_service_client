"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useApplicationQuery, ApplicationOverview } from "@/features/applications";

export default function ApplicationOverviewPage() {
  const params = useParams<{ applicationId: string }>();
  const applicationId = params?.applicationId || "";

  const { data: application, refetch } = useApplicationQuery(applicationId);

  if (!application) {
    return null; // Handled by layout
  }

  return <ApplicationOverview application={application} onRefresh={() => refetch()} />;
}
