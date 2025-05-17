import { CreateRequest } from "../../types/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putRequest } from "../../utils/apiService";
import { AxiosError } from "axios";

export async function updateRequest(requestId: string, payload: CreateRequest) {
  return putRequest(`/requests/${requestId}`, payload);
}

export function useUpdateTravelRequest() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateTravelRequestMutation, isPending } = useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: CreateRequest;
    }) => updateRequest(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelRequests"] });
    },
    onError: (error: AxiosError) => {
      console.error("Error updating travel request:", error);
      throw error;
    },
  });

  return { updateTravelRequestMutation, isPending };
}
