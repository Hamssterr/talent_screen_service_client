"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import QueryProvider from "./query-provider";

export interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Root composition provider for client contexts.
 * Order: ThemeProvider -> QueryProvider -> Children
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}

export default AppProviders;
