import React, { useEffect, useState } from "react";
import Table from "../../components/Approvals/Table";
import { getRequest } from "../../utils/apiService";
import RefreshButton from "../../components/RefreshButton";
import formatDate from "../../utils/formatDate";
import GoBack from "../../components/GoBack";

const columns = [
  { key: "status", header: "Estado" },
  { key: "motive", header: "Viaje" },
  { key: "title", header: "Motivo" },
  { key: "departureDate", header: "Fecha Salida" },
  { key: "country", header: "Lugar de Salida" },
];

export const Approvals: React.FC = () => {
  const [dataWithActions, setDataWithActions] = useState([]);

  // Fetch travel records data from API
  useEffect(() => {
    const fetchTravelRecords = async () => {
      try {
        const response = await getRequest("/requests/to-approve");
        setDataWithActions(
          response.map((trip: any) => ({
            ...trip,
            country: trip.destination.city,
            departureDate: formatDate(
              trip.requests_destinations.sort(
                (a: any, b: any) => a.destination_order - b.destination_order
              )[0].departure_date
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching travel records:", error);
      }
    };

    fetchTravelRecords();
  }, []);

  return (
    <>
      <GoBack />
      <div className="flex-1 p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[var(--blue)]">
            Viajes por Aprobar
          </h2>
          <RefreshButton />
        </div>

        <Table
          columns={columns}
          data={dataWithActions}
          itemsPerPage={5}
          link={"/requests"}
        />
      </div>
    </>
  );
};

export default Approvals;
