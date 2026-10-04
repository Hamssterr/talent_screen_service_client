"use client";

import * as React from "react";
import { User, Mail, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Candidate } from "../types/candidate.types";

export interface SelectedCandidateCardProps {
  candidate: Pick<Candidate, "id" | "fullName" | "email" | "phone">;
  onClear?: () => void;
  disabled?: boolean;
}

export function SelectedCandidateCard({
  candidate,
  onClear,
  disabled = false,
}: SelectedCandidateCardProps) {
  const initials = candidate.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3.5 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {initials || <User className="size-5" />}
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold text-foreground truncate">
            {candidate.fullName}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 truncate">
              <Mail className="size-3" />
              {candidate.email}
            </span>
            {candidate.phone && (
              <span className="flex items-center gap-1">
                <Phone className="size-3" />
                {candidate.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {onClear && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          aria-label="Thay đổi ứng viên"
          className="h-8 text-xs text-muted-foreground hover:text-foreground shrink-0 gap-1"
        >
          <X className="size-3.5" />
          <span>Thay đổi</span>
        </Button>
      )}
    </div>
  );
}
