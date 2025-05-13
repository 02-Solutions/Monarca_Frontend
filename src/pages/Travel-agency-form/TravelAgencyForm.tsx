/*
 * Historial.tsx - Travel history page component that displays a list of travel records
 * with minimal data: ID, trip title, travel date, destination, and request date.
 */

import { useState } from "react";
import DynamicTable from "../../components/Refunds/DynamicTable";
import Button from "../../components/Refunds/Button";
import { TravelAgencyFormData } from "./local/dummyData";

// Interface for travel records data
interface TravelRecord {
  id: string;
  title: string;
  travelDate: string;
  destination: string;
  days: number;
  passangers: number;
  transport: string;
  price: number;
  requestDate: string;
  status: string;
}

export const Historial = () => {
  // State to store selected travel record details
  // Columns schema for travel history table
  const columnsSchema = [
    { key: "id", header: "ID" },
    { key: "title", header: "Título del viaje" },
    { key: "travelDate", header: "Fecha del viaje" },
    { key: "destination", header: "Destino" },
    { key: "days", header: "Días" },
    { key: "passangers", header: "Pasajeros" },
    { key: "transport", header: "Transporte" },
    { key: "price", header: "Precio" },
    { key: "requestDate", header: "Fecha de solicitud" },
    { key: "status", header: "Estado" },
    {
      key: "action",
      header: "",
    },
  ];

  // Data with actions (edit buttons)
  const dataWithActions = TravelAgencyFormData.map((record) => ({
    ...record,
    action: (
      <Button
        label="Editar"
        onClickFunction={() => {
          /*
           * Placeholder for edit functionality.
           * Implement what happens when clicking Edit button here.
           */
        }}
      />
    ),
  }));

  return (
    <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-[#0a2c6d] mb-4">
        Historial de viajes
      </h2>

      {/* Travel history table component */}
      <Table columns={columnsSchema} data={dataWithActions} itemsPerPage={5} />
    </div>
  );
};

export default Historial;
