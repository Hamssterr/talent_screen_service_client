"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { JobDetail } from "@/features/jobs";

export default function JobDetailPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params?.jobId || "";

  return (
    <RequirePermission permission={Permissions.JobsRead}>
      <JobDetail jobId={jobId} />
    </RequirePermission>
  );
}
