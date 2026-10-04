"use client";

import * as React from "react";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { CandidateForm } from "@/features/candidates";

export default function NewCandidatePage() {
  return (
    <RequirePermission permission={Permissions.CandidatesCreate}>
      <CandidateForm mode="create" />
    </RequirePermission>
  );
}
