"use client";

import * as React from "react";
import { Mail, Phone, Calendar, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Candidate } from "../types/candidate.types";

export interface CandidateSummaryCardProps {
  candidate: Candidate;
  className?: string;
}

export function CandidateSummaryCard({ candidate, className }: CandidateSummaryCardProps) {
  const initials = candidate.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
            {initials || <User className="size-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground truncate">
              {candidate.fullName}
            </CardTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Mail className="size-3 shrink-0" />
              <span className="truncate">{candidate.email}</span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0 text-sm">
        {candidate.phone && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="size-3.5 shrink-0 text-foreground/70" />
            <span className="text-foreground font-medium">{candidate.phone}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="size-3.5 shrink-0 text-foreground/70" />
          <span>Tạo lúc: {new Date(candidate.createdAt).toLocaleString("vi-VN")}</span>
        </div>

        {candidate.owner && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <User className="size-3.5 shrink-0 text-foreground/70" />
            <span>Người tạo: <span className="text-foreground font-medium">{candidate.owner.name}</span></span>
          </div>
        )}

        {candidate.notes && (
          <div className="mt-3 rounded-md bg-muted/50 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-medium text-foreground mb-1">
              <FileText className="size-3.5" />
              <span>Ghi chú:</span>
            </div>
            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {candidate.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
