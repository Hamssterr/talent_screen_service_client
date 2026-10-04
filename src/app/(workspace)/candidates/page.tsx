"use client";

import * as React from "react";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { CandidateListScreen } from "@/features/candidates";

export default function CandidatesPage() {
  return (
    <RequirePermission permission={Permissions.CandidatesRead}>
      <CandidateListScreen />
    </RequirePermission>
  );
}
