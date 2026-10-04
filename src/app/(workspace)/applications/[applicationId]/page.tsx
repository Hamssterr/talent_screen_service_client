"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

export default function ApplicationIndexRedirect() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();
  const applicationId = params?.applicationId;

  React.useEffect(() => {
    if (applicationId) {
      router.replace(`/applications/${applicationId}/overview`);
    }
  }, [applicationId, router]);

  return null;
}
