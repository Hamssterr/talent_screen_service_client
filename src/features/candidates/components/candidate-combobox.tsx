"use client";

import * as React from "react";
import {
  Search,
  Loader2,
  UserPlus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "@/providers/session-provider";
import { Permissions } from "@/features/authorization/permission.constants";
import { candidatesApi } from "../api/candidates.api";
import { Candidate } from "../types/candidate.types";
import { CandidateSearchResult } from "./candidate-search-result";
import { SelectedCandidateCard } from "./selected-candidate-card";
import { QuickCreateCandidateDialog } from "./quick-create-candidate-dialog";
import { cn } from "@/lib/utils";
import { getApiError } from "@/lib/api/api-error";

export interface CandidateComboboxProps {
  value: string | null;
  selectedCandidate?: Candidate | null;
  onChange: (candidateId: string | null, candidate?: Candidate | null) => void;
  disabled?: boolean;
  error?: string;
  allowQuickCreate?: boolean;
}

export function CandidateCombobox({
  value,
  selectedCandidate,
  onChange,
  disabled = false,
  error,
  allowQuickCreate = true,
}: CandidateComboboxProps) {
  const { can } = useSession();
  const canCreate = can(Permissions.CandidatesCreate) && allowQuickCreate;

  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = React.useState(false);

  // Keep track of internal candidate details for rendering
  const [internalCandidate, setInternalCandidate] =
    React.useState<Candidate | null>(null);
  const activeCandidate = selectedCandidate || internalCandidate;

  // Active fetch abort controller ref
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Fetch candidate by ID if we have value but no object yet
  React.useEffect(() => {
    let isMounted = true;
    if (value && (!activeCandidate || activeCandidate.id !== value)) {
      candidatesApi
        .getCandidate(value)
        .then((cand) => {
          if (isMounted) {
            setInternalCandidate(cand);
          }
        })
        .catch(() => {
          // If 404/403, keep value but candidate card displays fallback
        });
    }
    return () => {
      isMounted = false;
    };
  }, [value, activeCandidate]);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch candidates from API
  const performSearch = React.useCallback(
    async (query: string, targetPage: number, append = false) => {
      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setFetchError(null);

      try {
        const result = await candidatesApi.listCandidates(
          {
            search: query.trim() || undefined,
            page: targetPage,
            limit: 10,
          },
          controller.signal,
        );

        if (append) {
          setCandidates((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newUnique = result.data.filter((c) => !existingIds.has(c.id));
            return [...prev, ...newUnique];
          });
        } else {
          setCandidates(result.data);
        }

        setPage(result.meta.page);
        setTotalPages(result.meta.totalPages);
        setActiveIndex(-1);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "CanceledError") {
          return; // Request was aborted
        }
        const apiErr = getApiError(err);
        setFetchError(apiErr.message || "Không thể tải danh sách ứng viên.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  // Debounced search trigger when searchTerm changes
  React.useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      performSearch(searchTerm, 1, false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, performSearch]);

  const handleInputFocus = () => {
    if (!isOpen) {
      setIsOpen(true);
      if (candidates.length === 0) {
        performSearch(searchTerm, 1, false);
      }
    }
  };

  const handleSelectCandidate = (candidate: Candidate) => {
    setInternalCandidate(candidate);
    onChange(candidate.id, candidate);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    setInternalCandidate(null);
    onChange(null, null);
    setSearchTerm("");
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (page < totalPages && !isLoadingMore) {
      performSearch(searchTerm, page + 1, true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < candidates.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < candidates.length) {
        handleSelectCandidate(candidates[activeIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleQuickCreateSuccess = (newCandidate: Candidate) => {
    handleSelectCandidate(newCandidate);
  };

  // If a candidate is already selected, render the SelectedCandidateCard
  if (value && activeCandidate) {
    return (
      <div className="space-y-1.5">
        <SelectedCandidateCard
          candidate={activeCandidate}
          onClear={disabled ? undefined : handleClearSelection}
          disabled={disabled}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Tìm kiếm ứng viên"
          placeholder="Tìm ứng viên theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            "pl-9 pr-9 h-9 text-xs",
            error ? "border-destructive focus-visible:ring-destructive/20" : "",
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-2.5 size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Dropdown Listbox */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 max-h-72 overflow-y-auto p-1">
          {fetchError ? (
            <div className="p-3 text-center text-xs space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-destructive font-medium">
                <AlertCircle className="size-4" />
                <span>{fetchError}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => performSearch(searchTerm, 1, false)}
                className="h-7 text-xs gap-1">
                <RefreshCw className="size-3" />
                Thử lại
              </Button>
            </div>
          ) : isLoading && candidates.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Đang tìm kiếm ứng viên...</span>
            </div>
          ) : candidates.length === 0 ? (
            <div className="p-4 text-center text-xs space-y-2">
              <p className="text-muted-foreground">
                {searchTerm.trim()
                  ? "Không tìm thấy ứng viên nào phù hợp."
                  : "Chưa có ứng viên nào trong danh sách."}
              </p>
              {canCreate && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsQuickCreateOpen(true)}
                  className="h-8 text-xs gap-1.5 text-primary border-primary/30">
                  <UserPlus className="size-3.5" />
                  <span>Tạo Ứng viên mới</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-0.5">
              {candidates.map((cand, idx) => (
                <CandidateSearchResult
                  key={cand.id}
                  candidate={cand}
                  isSelected={cand.id === value}
                  isActive={idx === activeIndex}
                  onSelect={handleSelectCandidate}
                />
              ))}

              {page < totalPages && (
                <div className="pt-1 border-t mt-1 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="w-full h-8 text-xs text-muted-foreground hover:text-foreground">
                    {isLoadingMore ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      "Xem thêm ứng viên..."
                    )}
                  </Button>
                </div>
              )}

              {canCreate && (
                <div className="pt-1 border-t mt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsQuickCreateOpen(true)}
                    className="w-full h-8 text-xs justify-start gap-1.5 text-primary font-normal">
                    <UserPlus className="size-3.5" />
                    <span>+ Tạo nhanh Ứng viên mới</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Create Dialog */}
      {canCreate && (
        <QuickCreateCandidateDialog
          open={isQuickCreateOpen}
          onOpenChange={setIsQuickCreateOpen}
          onCandidateCreated={handleQuickCreateSuccess}
          initialSearch={searchTerm}
        />
      )}
    </div>
  );
}
