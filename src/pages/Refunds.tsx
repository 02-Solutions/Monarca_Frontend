/**
 * Refunds page component that allows users to request refunds for their trips.
 * 
 * Last edit: April 15, 2025
 * Authors: José Zumaya
 */
import React from 'react';
import Table from '../components/Table';
import Button from '../components/Button';

/**
 * Refunds component that displays a table of trips and allows users to request refunds.
 * NOTE: Trip data is currently hardcoded and will be replaced with API calls
 * when backend service integration is complete.
 */
export const Refunds = () => {
  // NOTE: This is temporary hardcoded data until backend service connection is established
  const tripData = [
    { id: 1, tripName: 'Viaje a la playa', amount: 100, status: 'Pendiente' },
    { id: 2, tripName: 'Viaje a la montaña', amount: 200, status: 'Aprobado' },
    { id: 3, tripName: 'Viaje a la ciudad', amount: 150, status: 'Rechazado' },
    { id: 4, tripName: 'Viaje al campo', amount: 250, status: 'Pendiente' },
    { id: 5, tripName: 'Viaje a la selva', amount: 300, status: 'Aprobado' },
  ];

  // Create a new array with the action buttons added properly
  const dataWithActions = tripData.map(trip => ({
    ...trip,
    action: (
      <Button
        label="Comprobar" 
        onClickFunction={() => alert(`Botón de la fila ${trip.id} presionado`)}
      />
    )
  }));

  return (
    <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-[#0a2c6d] mb-3">
        Historial de viajes
      </h2>
      <Table
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'tripName', header: 'Nombre del viaje' },
          { key: 'amount', header: 'Monto' },
          { key: 'status', header: 'Estado' },
          { key: 'action', header: 'Acción' },
        ]}
        data={dataWithActions}
      />
    </div>
  );
};

export default Refunds;