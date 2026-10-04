"use client";

import * as React from "react";
import { RequirePermission } from "@/features/authorization/components/require-permission";
import { Permissions } from "@/features/authorization/permission.constants";
import { ApplicationListScreen } from "@/features/applications";

export default function ApplicationsPage() {
  return (
    <RequirePermission permission={Permissions.ApplicationsRead}>
      <ApplicationListScreen />
    </RequirePermission>
  );
}
