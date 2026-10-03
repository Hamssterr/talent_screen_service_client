import * as React from "react";
import { Suspense } from "react";
import { GuestGate } from "@/components/auth/guest-gate";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-200">
      {/* Top bar with theme toggle */}
      <header className="container mx-auto px-4 py-4 flex justify-end items-center">
        <ThemeToggle variant="compact" />
      </header>

      {/* Auth Content centered */}
      <main className="container mx-auto flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl">
          <Suspense fallback={null}>
            <GuestGate>{children}</GuestGate>
          </Suspense>
        </div>
      </main>

      {/* Simple accessible footer */}
      <footer className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TalentScreen. Nền tảng tuyển dụng và phỏng
        vấn AI.
      </footer>
    </div>
  );
}
