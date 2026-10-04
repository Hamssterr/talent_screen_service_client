import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { getApiError } from "@/lib/api/api-error";

export interface UseCvPreviewResult {
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  download: (customFilename?: string) => void;
}

export function useCvPreview(cvId?: string, defaultFilename?: string): UseCvPreviewResult {
  const query = useQuery({
    queryKey: ["cv-preview", cvId],
    queryFn: async ({ signal }) => {
      if (!cvId) throw new Error("cvId is required");
      const blob = await cvApi.downloadCvPdf(cvId, signal);
      return URL.createObjectURL(blob);
    },
    enabled: Boolean(cvId),
    staleTime: 60 * 1000,
    gcTime: 0,
  });

  const previewUrl = query.data ?? null;

  // Cleanup object URL when previewUrl changes or component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const download = React.useCallback(
    (customFilename?: string) => {
      if (!previewUrl) return;
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = customFilename || defaultFilename || "candidate_cv.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [previewUrl, defaultFilename],
  );

  return {
    previewUrl,
    isLoading: query.isLoading,
    error: query.error
      ? getApiError(query.error).message || "Không thể tải tệp PDF xem trước."
      : null,
    refetch: () => {
      query.refetch();
    },
    download,
  };
}
