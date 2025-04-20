/**
 * Refunds page component that allows users to request refunds for their trips.
 * Now with pagination support to improve user experience.
 *
 * Last edit: April 20, 2025
 * Authors: José Manuel García Zumaya
 */
import React from "react";
import Table from "../components/Table";
import Button from "../components/Button";

/**
 * Refunds component that displays a table of trips and allows users to request refunds.
 * Uses pagination to display a limited number of records per page.
 */
export const Refunds = () => {
  // NOTE: This is temporary hardcoded data until backend service connection is established
  const tripData = [
    {
      id: 1,
      tripName: "Viaje a la playa",
      amount: 1250.75,
      status: "Pendiente",
      date: "2025-02-15",
      destination: "Cancún, Quintana Roo",
      duration: 5,
      passengers: 3,
      transportation: "Avión",
      requestDate: "2025-03-01",
    },
    {
      id: 2,
      tripName: "Viaje a la montaña",
      amount: 2400.5,
      status: "Aprobado",
      date: "2025-01-22",
      destination: "Valle de Bravo",
      duration: 3,
      passengers: 4,
      transportation: "Automóvil",
      requestDate: "2025-02-05",
    },
    {
      id: 3,
      tripName: "Viaje a la ciudad",
      amount: 1750.0,
      status: "Rechazado",
      date: "2024-12-10",
      destination: "Ciudad de México",
      duration: 2,
      passengers: 2,
      transportation: "Autobús",
      requestDate: "2024-12-28",
    },
    {
      id: 4,
      tripName: "Viaje al campo",
      amount: 3200.25,
      status: "Pendiente",
      date: "2025-03-05",
      destination: "Rancho Los Álamos",
      duration: 4,
      passengers: 6,
      transportation: "Camioneta",
      requestDate: "2025-03-20",
    },
    {
      id: 5,
      tripName: "Viaje a la selva",
      amount: 4500.0,
      status: "Aprobado",
      date: "2024-11-18",
      destination: "Chiapas",
      duration: 7,
      passengers: 2,
      transportation: "Avión",
      requestDate: "2024-12-05",
    },
    {
      id: 6,
      tripName: "Viaje al pueblo mágico",
      amount: 1800.5,
      status: "En revisión",
      date: "2025-02-28",
      destination: "San Miguel de Allende",
      duration: 3,
      passengers: 4,
      transportation: "Automóvil",
      requestDate: "2025-03-15",
    },
    {
      id: 7,
      tripName: "Viaje al desierto",
      amount: 3850.75,
      status: "Pendiente",
      date: "2025-01-10",
      destination: "San Luis Potosí",
      duration: 5,
      passengers: 3,
      transportation: "Camioneta",
      requestDate: "2025-02-01",
    },
    {
      id: 8,
      tripName: "Tour gastronómico",
      amount: 2750.0,
      status: "Rechazado",
      date: "2024-10-25",
      destination: "Oaxaca",
      duration: 4,
      passengers: 2,
      transportation: "Avión",
      requestDate: "2024-11-10",
    },
    {
      id: 9,
      tripName: "Viaje de negocios",
      amount: 5200.25,
      status: "Aprobado",
      date: "2025-03-12",
      destination: "Monterrey",
      duration: 6,
      passengers: 1,
      transportation: "Avión",
      requestDate: "2025-03-25",
    },
    {
      id: 10,
      tripName: "Viaje cultural",
      amount: 2900.5,
      status: "En revisión",
      date: "2025-02-05",
      destination: "Querétaro",
      duration: 3,
      passengers: 5,
      transportation: "Autobús",
      requestDate: "2025-02-20",
    },
  ];

  // Create a new array with the action buttons added properly
  const dataWithActions = tripData.map((trip) => ({
    ...trip,
    action: (
      <Button
        label="Comprobar"
        onClick={() => alert(`Botón de la fila ${trip.id} presionado`)}
      />
    ),
  }));

  return (
    <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-[#0a2c6d] mb-1">
        Historial de viajes
      </h2>
      <Table
        columns={[
          { key: "id", header: "ID" },
          { key: "tripName", header: "Nombre del viaje" },
          { key: "date", header: "Fecha viaje" },
          { key: "destination", header: "Destino" },
          { key: "duration", header: "Días" },
          { key: "passengers", header: "Pasajeros" },
          { key: "transportation", header: "Transporte" },
          { key: "amount", header: "Monto" },
          { key: "requestDate", header: "Fecha solicitud" },
          { key: "status", header: "Estado" },
          { key: "action", header: "Acción" },
        ]}
        data={dataWithActions}
        itemsPerPage={5}
      />
    </div>
  );
};

export default Refunds;
