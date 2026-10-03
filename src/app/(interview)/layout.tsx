import * as React from "react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function CandidateInterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground transition-colors duration-200">
      {/* Public Candidate Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-peach text-peach-foreground flex items-center justify-center font-bold text-xs shadow-xs">
              TS
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">
              TalentScreen Candidate Interview
            </span>
          </div>
          <ThemeToggle variant="compact" />
        </div>
      </header>

      {/* Public Candidate Content Area */}
      <main className="container mx-auto flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl">{children}</div>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TalentScreen. Nền tảng phỏng vấn AI trực tuyến.
      </footer>
    </div>
  );
}
