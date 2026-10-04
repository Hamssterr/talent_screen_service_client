"use client";

import * as React from "react";
import { User, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Candidate } from "../types/candidate.types";

export interface CandidateSearchResultProps {
  candidate: Candidate;
  isSelected?: boolean;
  isActive?: boolean;
  onSelect: (candidate: Candidate) => void;
}

export function CandidateSearchResult({
  candidate,
  isSelected = false,
  isActive = false,
  onSelect,
}: CandidateSearchResultProps) {
  const initials = candidate.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(candidate)}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-sm transition-colors select-none",
        isActive || isSelected ? "bg-muted text-foreground" : "hover:bg-muted/60 text-foreground",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {initials || <User className="size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-xs sm:text-sm text-foreground truncate">
          {candidate.fullName}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
          <span className="flex items-center gap-1 truncate">
            <Mail className="size-3 shrink-0" />
            {candidate.email}
          </span>
          {candidate.phone && (
            <span className="hidden sm:flex items-center gap-1 shrink-0">
              <Phone className="size-3" />
              {candidate.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
