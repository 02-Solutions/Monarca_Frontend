import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../../utils/apiService";
import { Destination, DestinationOption } from "../../types/destinations";

async function fetchDestinations(): Promise<Destination[]> {
  return getRequest("/destinations");
}

export function useDestinations() {
  const {
    data: destinations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["destinations"],
    queryFn: fetchDestinations,
  });

  // Transform destinations into options format for the Select component
  // Ensure destinations is an array before mapping
  const destinationOptions: DestinationOption[] = Array.isArray(destinations)
    ? destinations.map((dest) => ({
        id: dest.id,
        name: `${dest.city}, ${dest.country}`,
      }))
    : [];

  return {
    destinations: Array.isArray(destinations) ? destinations : [],
    destinationOptions,
    isLoading,
    error,
  };
}
