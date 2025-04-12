// src/pages/Expenses.tsx
import { useState } from 'react';
import { useAuth } from "../hooks/auth/authContext";

export const Expenses = () => {
  const { userName } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedTripId, setSelectedTripId] = useState<string>("0033");
  
  // Sample travel data array with multiple examples
  const travelDataArray = [
    {
      id: "0033",
      employeeId: "000001",
      employeeName: "Juan Pérez",
      creditorId: "000001",
      position: "000001",
      email: "juan@gmail.com",
      society: "000001",
      status: "active",
      date: "16/03/2020",
      destination: "Cancún",
      country: "MX",
      reason: "Viaje",
      authorization: "Autorizado",
      settlement: "A liquidar",
      reimbursement: "$500",
      currency: "MXN",
      trip: {
        id: "0033",
        date: "16/03/2020",
        origin: "Ciudad de México, MX",
        destination: "Ciudad Mante, MX",
        originDate: "20/03/2016",
        destinationDate: "20/03/2016",
        originTime: "07:00:00",
        destinationTime: "18:00:00",
        reason: "Viaje de negocios",
        justification: "Viaje de negocios para nueva planta en Puebla",
        reservationDeadline: "2020/07/12 - 19:00:00"
      }
    },
    {
      id: "0045",
      employeeId: "000002",
      employeeName: "Ana Rodríguez",
      creditorId: "000002", 
      position: "000023",
      email: "ana.rodriguez@gmail.com",
      society: "000003",
      status: "pending",
      date: "25/04/2025",
      destination: "Guadalajara",
      country: "MX",
      reason: "Conferencia",
      authorization: "Pendiente",
      settlement: "En proceso",
      reimbursement: "$750",
      currency: "MXN",
      trip: {
        id: "0045",
        date: "25/04/2025",
        origin: "Ciudad de México, MX",
        destination: "Guadalajara, MX",
        originDate: "29/04/2025",
        destinationDate: "02/05/2025",
        originTime: "09:30:00",
        destinationTime: "16:45:00",
        reason: "Conferencia Anual de Marketing",
        justification: "Conferencia para actualización de estrategias de marketing digital y networking con potenciales clientes",
        reservationDeadline: "2025/04/20 - 18:00:00"
      }
    }
  ];
  
  // Get the selected travel data based on the trip ID
  const travelData = travelDataArray.find(trip => trip.id === selectedTripId) || travelDataArray[0];

  return (
    <div className="max-w-7xl mx-auto p-4">

      {/* Navigation */}
      <div className="flex mb-4 bg-gray-100">
        
        <div className="flex-1">
          <div className="bg-[var(--dark-blue)] font-semibold text-white p-2 flex">
            <div className="w-24 text-center border-r">Estado</div>
            <div className="w-24 text-center border-r">Viaje</div>
            <div className="w-32 text-center border-r">Fecha Salida</div>
            <div className="w-32 text-center border-r">Población</div>
            <div className="w-24 text-center border-r">País</div>
            <div className="w-24 text-center border-r">Razón</div>
            <div className="w-28 text-center border-r">Autorización</div>
            <div className="w-32 text-center border-r">Comprobación</div>
            <div className="w-28 text-center border-r">Reembolso</div>
            <div className="w-24 text-center">Moneda</div>
          </div>

          {/* Mapping through the travel data array to create multiple rows */}
          {travelDataArray.map((trip) => (
            <div 
              key={trip.id}
              className={`flex items-center p-1 border-b border-gray-300 cursor-pointer hover:bg-gray-300 ${selectedTripId === trip.id ? 'bg-gray-200' : 'bg-gray-100'}`}
              onClick={() => setSelectedTripId(trip.id)}
            >
              <div className="w-24 text-center flex items-center justify-center">
                <div className={`w-3 h-3 ${trip.status === 'active' ? 'bg-blue-800' : 'bg-yellow-500'} rounded-full mr-1`}></div>
              </div>
              <div className="w-24 text-center">{trip.id}</div>
              <div className="w-32 text-center">{trip.date}</div>
              <div className="w-32 text-center">{trip.destination}</div>
              <div className="w-24 text-center">{trip.country}</div>
              <div className="w-24 text-center">{trip.reason}</div>
              <div className="w-28 text-center">{trip.authorization}</div>
              <div className="w-32 text-center">{trip.settlement}</div>
              <div className="w-28 text-center">{trip.reimbursement}</div>
              <div className="w-24 text-center flex items-center justify-center">
                <span className="mr-2">{trip.currency}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 10a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1z"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Details */}
      <div className="bg-gray-100 p-4 grid grid-cols-3 gap-4">
        <div className="flex">
          <div className="mr-2">Empleado:</div>
          <div className="font-medium">{travelData.employeeId}</div>
        </div>
        <div className="flex">
          <div className="mr-2">Nombre:</div>
          <div className="font-medium">{travelData.employeeName}</div>
        </div>
        <div className="flex">
          <div className="mr-2">Acreedor:</div>
          <div className="font-medium">{travelData.creditorId}</div>
        </div>
        <div className="flex">
          <div className="mr-2">Posición:</div>
          <div className="font-medium">{travelData.position}</div>
        </div>
        <div className="flex">
          <div className="mr-2">Correo electrónico:</div>
          <div className="font-medium">{travelData.email}</div>
        </div>
        <div className="flex">
          <div className="mr-2">Sociedad:</div>
          <div className="font-medium">{travelData.society}</div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex">
          <div className="bg-gray-200 w-32 h-32 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-bold text-lg mb-3">Viaje</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-medium">{travelData.trip.origin}</div>
                <div className="text-sm text-gray-600">{travelData.trip.originDate} - {travelData.trip.originTime}</div>
              </div>
              <div>
                <div className="font-medium">{travelData.trip.destination}</div>
                <div className="text-sm text-gray-600">{travelData.trip.destinationDate} - {travelData.trip.destinationTime}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">Motivo</h3>
          <div className="font-medium">{travelData.trip.reason}</div>
          
          <h3 className="font-bold text-lg mt-4 mb-3">Fecha límite para la reserva</h3>
          <div className="font-medium">{travelData.trip.reservationDeadline}</div>
        </div>
      </div>

      {/* Justification */}
      <div className="mt-4">
        <h3 className="font-bold text-lg mb-3">Justificación</h3>
        <div className="font-medium">{travelData.trip.justification}</div>
      </div>

      {/* Reservation Sections */}
      <div className="mt-8 grid grid-cols-3 gap-6">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-blue-800 rounded-full mr-2"></div>
            <h3 className="font-bold">Reserva de Hospedaje</h3>
          </div>
          
          <div className="mb-3">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Hotel</option>
            </select>
          </div>
          
          <div className="mb-3">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Ciudad de destino</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1 text-sm">Fecha de inicio:</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" defaultValue="15/03/2025" />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1 text-sm">Fecha de término:</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" defaultValue="18/03/2025" />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1 text-sm">Número de reservación:</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" defaultValue="XXXXXXXX" />
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-blue-800 rounded-full mr-2"></div>
            <h3 className="font-bold">Reserva de viaje</h3>
          </div>
          
          <div className="mb-3">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Empresa</option>
            </select>
          </div>
          
          <div className="mb-3">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Ciudad de destino</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1 text-sm">Viaje redondo:</label>
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Si</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1 text-sm">Fecha de ida:</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" defaultValue="15/03/2025" />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1 text-sm">Fecha de regreso:</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded" defaultValue="9/05/2025" />
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-blue-800 rounded-full mr-2"></div>
            <h3 className="font-bold">Reserva de transporte</h3>
          </div>
          
          <div className="mb-3">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button className="px-6 py-2 bg-blue-800 text-white rounded">Cancelar</button>
        <button className="px-6 py-2 bg-blue-800 text-white rounded">Confirmar</button>
      </div>

      {/* Footer */}
      <div className="mt-20 py-4 border-t border-gray-300 text-sm text-gray-600 flex justify-between">
        <div>Copyright © 2024-25 Soluciones</div>
        <div>All Rights Reserved | <span className="text-blue-500">Términos y Condiciones</span> | <span className="text-blue-500">Cookie Policy</span></div>
      </div>
    </div>
  );
};

export default Expenses;
