import * as React from "react";
import { SessionProvider } from "@/providers/session-provider";
import { AuthGate } from "@/components/auth/auth-gate";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthGate>
        {children}
      </AuthGate>
    </SessionProvider>
  );
}
