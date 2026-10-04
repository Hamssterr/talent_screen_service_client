"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { CandidateDetail } from "@/features/candidates";

export default function CandidateDetailPage() {
  const params = useParams<{ candidateId: string }>();
  const candidateId = params?.candidateId || "";

  return (
    <RequirePermission permission={Permissions.CandidatesRead}>
      <CandidateDetail candidateId={candidateId} />
    </RequirePermission>
  );
}
