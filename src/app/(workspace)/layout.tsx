import * as React from "react";
import { SessionProvider } from "@/providers/session-provider";
import { AuthGate } from "@/components/auth/auth-gate";
import { AppShell } from "@/components/layout";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthGate>
        <AppShell>{children}</AppShell>
      </AuthGate>
    </SessionProvider>
  );
}
