import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../../utils/apiService";
import { CreateRequest } from "../../types/requests";

export async function fetchTravelRequest(id: string): Promise<CreateRequest> {
  return getRequest(`/requests/${id}`);
}

export function useGetRequest(id: string) {
  return useQuery({
    queryKey: ["travelRequest", id],
    queryFn: () => fetchTravelRequest(id),
    enabled: !!id,
  });
}
