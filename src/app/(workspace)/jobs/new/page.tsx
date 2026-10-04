"use client";

import * as React from "react";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { JobForm } from "@/features/jobs";

export default function NewJobPage() {
  return (
    <RequirePermission permission={Permissions.JobsCreate}>
      <JobForm mode="create" />
    </RequirePermission>
  );
}
