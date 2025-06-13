/*
 * Refunds page component, which displays a list of trips and allows users to request refunds.
 * The component includes a table of trips with an action button to request a refund.
 * When a refund is requested, a form is displayed with fields for entering details about the refund request.
 */

import { useState, useEffect } from "react";
import Table from "../../components/Refunds/Table";
import { getRequest } from "../../utils/apiService";
import Button from "../../components/Refunds/Button";
import { toast } from "react-toastify";
import RefreshButton from "../../components/RefreshButton";
import formatDate from "../../utils/formatDate";
import formatMoney from "../../utils/formatMoney";
import GoBack from "../../components/GoBack";
import { useNavigate } from "react-router-dom";
import { Tutorial } from "../../components/Tutorial";
import { useApp } from "../../hooks/app/appContext";


interface Trip {
  id: number | string;
  tripName: string;
  amount: number;
  date: string;
  destination: string;
  requestDate: string;
  status: string;
}

const renderStatus = (status: string) => {
  let statusText = "";
  let styles = "";
  switch (status) {
    case "Pending Review":
      statusText = "En revisión";
      styles = "text-[#55447a] bg-[#bea8ef]";
      break;
    case "Denied":
      statusText = "Denegado";
      styles = "text-[#680909] bg-[#eca6a6]";
      break;
    case "Cancelled":
      statusText = "Cancelado";
      styles = "text-[#680909] bg-[#eca6a6]";
      break;
    case "Changes Needed":
      statusText = "Cambios necesarios";
      styles = "text-[#755619] bg-[#f1dbb1]";
      break;
    case "Pending Reservations":
      statusText = "Reservas pendientes";
      styles = "text-[#8c5308] bg-[#f1c180]";
      break;
    case "Pending Accounting Approval":
      statusText = "Contabilidad pendiente";
      styles = "text-[var(--dark-blue)] bg-[#99b5e3]";
      break;
    case "Pending Vouchers Approval":
      statusText = "Comprobantes pendientes";
      styles = "text-[var(--dark-blue)] bg-[#c6c4fb]";
      break;
    case "In Progress":
      statusText = "En progreso";
      styles = "text-[var(--dark-blue)] bg-[#b7f1f1]";
      break;
    case "Pending Refund Approval": 
      statusText = "Reembolso pendiente";
      styles = "text-[#575107] bg-[#f0eaa5]";
      break;
    case "Completed": 
      statusText = "Completado";
      styles = "text-[#24390d] bg-[#c7e6ab]";
      break;
    default:
      statusText = status;
      styles = "text-white bg-[#6c757d]";
    }
    return (
      <span className={`text-xs p-1 rounded-sm ${styles}`}>
        {statusText}
      </span>
    )
}

export const CheckRefunds = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { handleVisitPage, tutorial, setTutorial } = useApp();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await getRequest("/requests/refund-to-approve-SOI");
        setTrips(response.map((trip: any) => ({
          ...trip,
          status: renderStatus(trip.status),
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

  useEffect(() => {
      // Get the visited pages from localStorage
      const visitedPages = JSON.parse(localStorage.getItem("visitedPages") || "[]");
      // Check if the current page is already in the visited pages
      const isPageVisited = visitedPages.includes(location.pathname);
  
      // If the page is not visited, set the tutorial to true
      if (!isPageVisited) {
        setTutorial(true);
      }
      // Add the current page to the visited pages
      handleVisitPage();
    }, []);

  const columnsSchemaTrips = [
    { key: "status", header: "Estatus" },
    { key: "title", header: "Nombre del viaje" },
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

  const dataWithActions = trips.map((trip, index: number) => ({
    ...trip,
    action: (
      <Button
        id={`refund-details-${index}`}
        className="bg-[var(--white)] text-[var(--blue)] p-1 rounded-sm"
        label="Registrar"
        onClickFunction={() => navigate(`/requests/${trip.id}`)}
      />
    ),
  }));

  return (
      <>
      <Tutorial page="checkRefunds" run={tutorial}>
        <GoBack />
        <div className="flex-1 p-6 bg-[#eaeced] rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[var(--blue)]">
                Viajes con reembolsos por revisar
            </h2>
            <RefreshButton />
          </div>

          <div id="list_requests">
            <Table
              columns={columnsSchemaTrips}
              data={dataWithActions}
              itemsPerPage={7}
            />
        </div>
          </div>
      </Tutorial>
      </>
  );
};

export default CheckRefunds;
