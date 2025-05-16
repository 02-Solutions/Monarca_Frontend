import { CreateRequest } from "../../types/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postRequest } from "../../utils/apiService";
import { AxiosError } from "axios";

export async function createRequest(payload: CreateRequest) {
  return postRequest("/requests", payload);
}

export function useCreateTravelRequest() {
  const queryClient = useQueryClient();

  const { mutateAsync: createTravelRequestMutation, isPending } = useMutation({
    mutationFn: (payload: CreateRequest) => createRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travelRequests"] });
    },
    onError: (error: AxiosError) => {
      console.error("Error creating travel request:", error);
      throw error;
    },
  });

  return { createTravelRequestMutation, isPending };
}
