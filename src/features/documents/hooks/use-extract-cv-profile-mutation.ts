import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";
import { CvExtractionResponse, ExtractCvProfileInput } from "../types/cv.types";

export interface ExtractCvProfileVariables {
  id: string;
  data: ExtractCvProfileInput;
  idempotencyKey: string;
}

export function useExtractCvProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<CvExtractionResponse, unknown, ExtractCvProfileVariables>({
    mutationFn: ({ id, data, idempotencyKey }) => {
      return cvApi.extractCvProfile(id, data, idempotencyKey);
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: cvKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: cvKeys.lists(),
      });
    },
  });
}
