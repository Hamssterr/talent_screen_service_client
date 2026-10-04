"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { ApplicationForm } from "@/features/applications";

export default function NewApplicationPage() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId") || undefined;
  const jobId = searchParams.get("jobId") || undefined;

  return (
    <RequirePermission permission={Permissions.ApplicationsCreate}>
      <ApplicationForm
        initialCandidateId={candidateId}
        initialJobId={jobId}
      />
    </RequirePermission>
  );
}
