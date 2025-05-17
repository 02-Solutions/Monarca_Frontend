/*
 * Refunds page component, which displays a list of trips and allows users to request refunds.
 * The component includes a table of trips with an action button to request a refund.
 * When a refund is requested, a form is displayed with fields for entering details about the refund request.
 */

import { useState, useEffect } from "react";
import Table from "../../components/Refunds/Table";
import { getRequest } from "../../utils/apiService";
import Button from "../../components/Refunds/Button";
import { useNavigate } from "react-router-dom";

interface Trip {
  id: number | string;
  tripName: string;
  amount: number;
  date: string;
  destination: string;
  requestDate: string;
}

const API_ENDPOINTS = {
  TRIPS: "https://680ff5f827f2fdac240fe541.mockapi.io/monarca/trips",
};

export const Refunds = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRequest(
          API_ENDPOINTS.TRIPS,
          {},
          { withCredentials: false }
        );
        setTrips(response);
      } catch (err) {
        setError("Error desconocido al cargar los viajes");

        console.error(
          "Error al cargar viajes: ",
          err instanceof Error ? err.message : err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const columnsSchemaTrips = [
    { key: "id", header: "ID" },
    { key: "tripName", header: "Nombre del viaje" },
    { key: "date", header: "Fecha viaje" },
    { key: "destination", header: "Destino" },
    { key: "amount", header: "Monto" },
    { key: "requestDate", header: "Fecha solicitud" },
    { key: "action", header: "" },
  ];
  
  if (loading) {
    return (
      <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <p className="text-center">Cargando datos de viajes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <p className="text-center text-red-500">Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#0a2c6d] text-white rounded-md hover:bg-[#0d3d94] mx-auto block"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }
  const dataWithActions = trips.map((trip) => ({
    ...trip,
    action: (
      <Button
        label="Comprobar"
        onClickFunction={() => navigate(`/refunds/${trip.id}`)}
      />
    ),
  }));

  return (
    <div className="flex-1 p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[var(--blue)]">
          Viajes por Aprobar
        </h2>
        {/* <RefreshButton />*/}
      </div>

      <Table
        columns={columnsSchemaTrips}
        data={dataWithActions}
        itemsPerPage={5}
      />
    </div>
  );
};

export default Refunds;
