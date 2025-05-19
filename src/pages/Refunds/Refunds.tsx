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
import { toast } from "react-toastify";
import RefreshButton from "../../components/RefreshButton";
import formatDate from "../../utils/formatDate";
import formatMoney from "../../utils/formatMoney";
import GoBack from "../../components/GoBack";

interface Trip {
  id: number | string;
  tripName: string;
  amount: number;
  date: string;
  destination: string;
  requestDate: string;
  status: string;
}

export const Refunds = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);

        const response = await getRequest("/requests/all");
        setTrips(response.filter((trip: Trip) => trip.status === "In Progress").map((trip: any) => ({
          ...trip,
          date: formatDate(trip.requests_destinations.sort((a: any, b: any) => a.destination_order - b.destination_order)[0].departure_date),
          advance_money: formatMoney(trip.advance_money),
          origin: trip.destination.city,
          createdAt: formatDate(trip.createdAt),
        })));
      } catch (err) {
        toast.error(
          "Error al cargar los viajes. Por favor, inténtelo de nuevo más tarde."  
        );
    
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
    { key: "title", header: "Nombre del viaje" },
    { key: "status", header: "Estatus" },
    { key: "date", header: "Fecha viaje" },
    { key: "origin", header: "Lugar de Salida" },
    { key: "advance_money", header: "Anticipo" },
    { key: "createdAt", header: "Fecha solicitud" },
    { key: "action", header: "" },
  ];
  
  if (loading) {
    return (
      <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <p className="text-center">Cargando datos de viajes...</p>
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
      <>
        <GoBack />
        <div className="flex-1 p-6 bg-[#eaeced] rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[var(--blue)]">
                Viajes con gastos por comprobar
            </h2>
            <RefreshButton />
          </div>

          <Table
            columns={columnsSchemaTrips}
            data={dataWithActions}
            itemsPerPage={7}
          />
        </div>
      </>
  );
};

export default Refunds;
