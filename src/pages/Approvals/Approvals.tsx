import React, { useEffect, useState } from "react";
import Table from "../../components/Approvals/Table";
import InputField from "../../components/Refunds/InputField";
import Button from "../../components/Refunds/Button";
import { MdRefresh } from "react-icons/md";

import { approvalsData } from "./local/dummyData";

interface Trip {
  id: number;
  code: string;
  departureDate: string;
  city: string;
  country: string;
  reason: string;
  authorization: string;
  checking: string;
  refund: string;
  currency: string;
  employee: string;
  position: string;
  name: string;
  email: string;
  creditor: string;
  company: string;
}

const columns = [
  { key: "statusIndicator", header: "Estado" },
  { key: "code", header: "Viaje" },
  { key: "departureDate", header: "Fecha Salida" },
  { key: "city", header: "Población" },
  { key: "country", header: "País" },
  { key: "reason", header: "Razón" },
  { key: "authorization", header: "Autorización" },
  { key: "checking", header: "Comprobación" },
  { key: "refund", header: "Reembolso" },
  { key: "currency", header: "Moneda" },
];

export const Approvals: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expandedTripId, setExpandedTripId] = useState<number | null>(null);

  useEffect(() => {
    // Añadimos statusIndicator con círculo verde
    const tripsWithStatus = approvalsData.map((t) => ({
      ...t,
      statusIndicator: <span className="text-green-500">●</span>,
    }));
    setTrips(tripsWithStatus);
  }, []);

  // Construimos data para Table incluyendo dropdown y botón expandir en cada fila
  const dataWithActions = trips.map((t) => ({
    ...t,
    // En cada fila agregamos propiedades extra para que Table las muestre

  }));


  return (
    <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#0a2c6d]">Viajes por aprobar</h2>
        <div className="flex items-center space-x-2">
          <Button
            label="Viajes"
            className="bg-[#0a2c6d] text-white px-4 py-2 rounded-md"
            onClickFunction={() => {}}
          />
          <button
            onClick={() => {
              const refreshed = approvalsData.map((t) => ({
                ...t,
                statusIndicator: <span className="text-green-500">●</span>,
              }));
              setTrips(refreshed);
              setExpandedTripId(null);
            }}
            className="p-2 bg-white rounded-md shadow hover:bg-gray-100"
            aria-label="Refrescar viajes"
          >
            <MdRefresh className="h-6 w-6 text-[#0a2c6d]" />
          </button>
        </div>
      </div>

      <Table columns={columns} data={dataWithActions} itemsPerPage={5} />

      {expandedTripId !== null && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          {(() => {
            const t = trips.find((x) => x.id === expandedTripId)!;
            return (
              <div className="grid grid-cols-2 gap-6">
                <InputField label="Empleado" value={t.employee} disabled onChange={() => {}} />
                <InputField label="Nombre" value={t.name} disabled onChange={() => {}} />
                <InputField label="Posición" value={t.position} disabled onChange={() => {}} />
                <InputField label="Correo electrónico" value={t.email} disabled onChange={() => {}} />
                <InputField label="Acreedor" value={t.creditor} disabled onChange={() => {}} />
                <InputField label="Sociedad" value={t.company} disabled onChange={() => {}} />
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Approvals;
