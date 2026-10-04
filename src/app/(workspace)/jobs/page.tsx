"use client";

import * as React from "react";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { JobListScreen } from "@/features/jobs";

export default function JobsPage() {
  return (
    <RequirePermission permission={Permissions.JobsRead}>
      <JobListScreen />
    </RequirePermission>
  );
}
