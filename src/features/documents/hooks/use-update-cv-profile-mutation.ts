import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";
import { CvVersionDetail, UpdateCvProfileInput } from "../types/cv.types";

export interface UpdateCvProfileVariables {
  id: string;
  data: UpdateCvProfileInput;
}

export function useUpdateCvProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<CvVersionDetail, unknown, UpdateCvProfileVariables>({
    mutationFn: ({ id, data }) => {
      return cvApi.updateCvProfile(id, data);
    },
    onSuccess: (updatedCv) => {
      queryClient.setQueryData(cvKeys.detail(updatedCv.id), updatedCv);
      queryClient.invalidateQueries({
        queryKey: cvKeys.detail(updatedCv.id),
      });
      queryClient.invalidateQueries({
        queryKey: cvKeys.lists(),
      });
    },
  });
}
