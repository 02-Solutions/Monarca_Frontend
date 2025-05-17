import { RequestDestination } from "./requestDestinations";

export type CreateRequest = {
  id_origin_city: string;
  title: string;
  motive: string;
  requirements?: string;
  priority: "alta" | "media" | "baja";
  requests_destinations: RequestDestination[];
};
