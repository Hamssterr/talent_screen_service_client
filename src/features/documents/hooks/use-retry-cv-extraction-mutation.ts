import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";
import { CvExtractionResponse, RetryCvExtractionInput } from "../types/cv.types";

export interface RetryCvExtractionVariables {
  id: string;
  data: RetryCvExtractionInput;
  idempotencyKey: string;
}

export function useRetryCvExtractionMutation() {
  const queryClient = useQueryClient();

  return useMutation<CvExtractionResponse, unknown, RetryCvExtractionVariables>({
    mutationFn: ({ id, data, idempotencyKey }) => {
      return cvApi.retryCvExtraction(id, data, idempotencyKey);
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
