export type RequestDestination = {
  id_destination: string;
  destination_order: number;
  stay_days: number;
  arrival_date: string; // ISO-8601
  departure_date: string; // ISO-8601
  is_hotel_required: boolean;
  is_plane_required: boolean;
  is_last_destination: boolean;
  details?: string;
};
