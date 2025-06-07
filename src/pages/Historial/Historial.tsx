/*
 * Historial.tsx - Travel history page component that displays a list of travel records
 * with minimal data: ID, trip title, travel date, destination, and request date.
 */

import Table from "../../components/Refunds/Table";
import Button from "../../components/Refunds/Button";
import { useState, useEffect } from "react";
import { getRequest } from "../../utils/apiService";
import formatDate from "../../utils/formatDate";
import { Permission, useAuth } from "../../hooks/auth/authContext";
import RefreshButton from "../../components/RefreshButton";
import { useNavigate } from "react-router-dom";
import GoBack from "../../components/GoBack";

//Interface for travel records data
//interface TravelRecord {
//id: string;
//title: string;
//travelDate: string;
//destination: string;
//requestDate: string;
//}
// // Interface for travel records data
// interface TravelRecord {
//   id: string;
//   title: string;
//   travelDate: string;
//   destination: string;
//   requestDate: string;
// }

export const Historial = () => {
  // State to store selected travel record details
  // const [selectedTravel, setSelectedTravel] = useState<TravelRecord | null>(null);
  const [dataWithActions, setDataWithActions] = useState([]);
  const { authState } = useAuth();
  const navigate = useNavigate();

  // Fetch travel records data from API
  useEffect(() => {
    const fetchTravelRecords = async () => {
      try {
        const endpoint = 
          authState.userPermissions.includes("create_request" as Permission)
            ? "/requests/user"
            : authState.userPermissions.includes("check_budgets" as Permission)
            ? "/requests/to-approve-SOI"
            : "/requests/all"
        let response = await getRequest(endpoint);
        if(authState.userPermissions.includes("approve_request" as Permission)) {
          response = response.filter((record: any) => !["Pending Review", "Denied", "Cancelled"].includes(record.status) && record.id_admin === authState.userId);
        }
        if(authState.userPermissions.includes("submit_reservations" as Permission)) {
          const travelAgentsIds = response.map((request: any) => request.travel_agency.users.map((user: any) => user.id)).flat();
          response = response.filter((record: any) => !["Pending Review", "Denied", "Cancelled", "Changes Needed", "Pending Reservations"].includes(record.status) && travelAgentsIds.includes(authState.userId));
        }
        if(authState.userPermissions.includes("check_budgets" as Permission)) {
          response = response.filter((record: any) => ["Pending Accounting Approval"].includes(record.status) && record.id_SOI === authState.userId);
        }
        // Data with actions (edit buttons)
        setDataWithActions(response?.map((record: any, index: number) => ({
          ...record,
          createdAt: formatDate(record.createdAt),
          country: record.destination.city,
          departureDate: formatDate(record.requests_destinations.sort((a: any, b: any) => a.destination_order - b.destination_order)[0].departure_date),
          index,
          action: (
            <Button
              label="Ver detalles"
              id={`details-${index}`}
              onClickFunction={() => {
                navigate(`/requests/${record.id}`);
              }}
            />
          ),
        })));
        //   action: record.status == "Changes Needed" && (
        //     <Button
        //       label="Editar"
        //       onClickFunction={() => {
        //         navigate(`/requests/${record.id}/edit`);
        //       }}
        //     />
        //   ),
        // })));
      } catch (error) {
        console.error("Error fetching travel records:", error);
      }
    };

    fetchTravelRecords();
  }, []);

  // Columns schema for travel history table
  const columnsSchema = [
    { key: "status", header: "Estado" },
    { key: "title", header: "Viaje" },
    { key: "motive", header: "Motivo" },
    { key: "departureDate", header: "Fecha del viaje" },
    { key: "country", header: "Lugar de Salida" },
    { key: "createdAt", header: "Fecha de solicitud" },
    { key: "action", header: "Detalles" },
  ];

  return (
    <>
      <GoBack />
      <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#0a2c6d] mb-4">
              Historial de viajes
            </h2>
            <RefreshButton />
        </div>

        {/* Travel history table component */}
        <Table columns={columnsSchema} data={dataWithActions} itemsPerPage={5} />
      </div>
    </>
  );
};

export default Historial;
