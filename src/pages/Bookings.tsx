import { useEffect, useState } from "react";
import RefreshButton from "../components/RefreshButton";
import Table from "../components/Refunds/Table";
import { getRequest } from "../utils/apiService";
import formatDate from "../utils/formatDate";
import { Link } from "react-router-dom";
import GoBack from "../components/GoBack";
import { Tutorial } from "../components/Tutorial";
import { useApp } from "../hooks/app/appContext";

const columns = [
  { key: "status", header: "Estado" },
  { key: "motive", header: "Motivo" },
  { key: "title", header: "Viaje" },
  { key: "departureDate", header: "Fecha Salida" },
  { key: "country", header: "Lugar de Salida" },
  { key: "action", header: "" },
];

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
    <span className={`text-xs p-1 rounded-sm ${styles}`}>{statusText}</span>
  );
};

const Bookings = () => {
  const [dataWithActions, setDataWithActions] = useState([]);
  const { handleVisitPage, tutorial, setTutorial } = useApp();

  // Fetch travel records data from API
  useEffect(() => {
    const fetchTravelRecords = async () => {
      try {
        const response = await getRequest("/requests/to-reserve");
        setDataWithActions(
          response.map((trip: any) => ({
            ...trip,
            status: renderStatus(trip.status),
            country: trip.destination.city,
            departureDate: formatDate(
              trip.requests_destinations.sort(
                (a: any, b: any) => a.destination_order - b.destination_order
              )[0].departure_date
            ),
            action: (
              <Link
                to={`/bookings/${trip.id}`}
                className="bg-[var(--white)] text-[var(--blue)] p-1 rounded-sm"
              >
                Reservar
              </Link>
            ),
          }))
        );
      } catch (error) {
        console.error("Error fetching travel records:", error);
      }
    };

    fetchTravelRecords();
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

  return (
    <>
    <Tutorial page="bookings" run={tutorial}>
      <GoBack />
      <div className="flex-1 p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#0a2c6d]">
            Viajes por Reservar
          </h2>
          <RefreshButton />
        </div>

        <div id="list_requests">
          <Table columns={columns} data={dataWithActions} itemsPerPage={5} />
        </div>
      </div>
    </Tutorial>
    </>
  );
};

export default Bookings;
