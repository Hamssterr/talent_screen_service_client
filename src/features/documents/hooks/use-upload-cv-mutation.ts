import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosProgressEvent } from "axios";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";
import { applicationKeys } from "@/features/applications/api/applications.keys";
import { CvVersionSafe } from "../types/cv.types";

export interface UploadCvVariables {
  file: File;
  idempotencyKey: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: AbortSignal;
}

export function useUploadCvMutation(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation<CvVersionSafe, unknown, UploadCvVariables>({
    mutationFn: ({ file, idempotencyKey, onUploadProgress, signal }) => {
      return cvApi.uploadCvVersion(
        applicationId,
        file,
        idempotencyKey,
        onUploadProgress,
        signal,
      );
    },
    onSuccess: (newCv) => {
      // Invalidate CV list of application
      queryClient.invalidateQueries({
        queryKey: cvKeys.list(applicationId),
      });

      // Set/invalidate new CV detail
      queryClient.invalidateQueries({
        queryKey: cvKeys.detail(newCv.id),
      });

      // Invalidate application detail because currentCvVersionId & version changed
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(applicationId),
      });
      queryClient.invalidateQueries({
        queryKey: applicationKeys.lists(),
      });
    },
  });
}
