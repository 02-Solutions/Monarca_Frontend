import { useEffect, useState } from "react";
import RefreshButton from "../components/RefreshButton";
import Table from "../components/Refunds/Table";
import { getRequest } from "../utils/apiService";
import formatDate from "../utils/formatDate";

// Type for form data rows
interface FormData {
  [key: string]: string | number | boolean | null | undefined;
}

const columns = [
  { key: "status", header: "Estado" },
  { key: "motive", header: "Motivo" },
  { key: "title", header: "Viaje" },
  { key: "departureDate", header: "Fecha Salida" },
  { key: "country", header: "Lugar de Salida" },
];

const Bookings = () => {
  const [dataWithActions, setDataWithActions] = useState([]);

  // Fetch travel records data from API
  useEffect(() => {
    const fetchTravelRecords = async () => {
      try {
        // const response = await getRequest("/requests/all");
        // setDataWithActions(response.map((trip: any) => ({
        //   ...trip,
        //   country: trip.destination.city,
        //   departureDate: formatDate(trip.requests_destinations.sort((a: any, b: any) => a.destination_order - b.destination_order)[0].departure_date),
        //   action: (
        //     <button
        //       onClick={() => {
        //         setExpandedTripId((prev) => (prev === trip.id ? null : trip.id));
        //       }}
        //       className="p-2 bg-white rounded-md shadow hover:bg-gray-100"
        //       aria-label="Ver detalles del viaje"
        //     >
        //       {expandedTripId === trip.id ? "Ocultar" : "Ver"}
        //     </button>
        //   ),
        // })));
      } catch (error) {
        console.error("Error fetching travel records:", error);
      }
    };

    fetchTravelRecords();
  }, []);

  return (
    <div className="flex-1 p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#0a2c6d]">
            Viajes por Reservar
          </h2> 
          <RefreshButton />
      </div>

        <Table 
          columns={columns} 
          data={dataWithActions} 
          itemsPerPage={5}
          link={"/bookings"}
      />
    </div>
  );
};

export default Bookings;
