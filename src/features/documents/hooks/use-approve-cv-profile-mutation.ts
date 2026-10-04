import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cvApi } from "../api/cv.api";
import { cvKeys } from "../api/cv.keys";
import { applicationKeys } from "@/features/applications/api/applications.keys";
import { CvVersionDetail, ApproveCvProfileInput } from "../types/cv.types";

export interface ApproveCvProfileVariables {
  id: string;
  applicationId: string;
  data: ApproveCvProfileInput;
}

export function useApproveCvProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<CvVersionDetail, unknown, ApproveCvProfileVariables>({
    mutationFn: ({ id, data }) => {
      return cvApi.approveCvProfile(id, data);
    },
    onSuccess: (approvedCv, variables) => {
      queryClient.setQueryData(cvKeys.detail(approvedCv.id), approvedCv);
      queryClient.invalidateQueries({
        queryKey: cvKeys.detail(approvedCv.id),
      });
      queryClient.invalidateQueries({
        queryKey: cvKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: applicationKeys.detail(variables.applicationId),
      });
    },
  });
}
