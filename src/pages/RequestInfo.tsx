import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestInfo: React.FC = () => {
  // Estados
  const [comment, setComment] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');


  const data = {
    id: '7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e',
    id_user: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0',
    id_admin: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    id_origin_city: 'f405305f-0ce8-41c7-98f2-a88fc5842292',
    motive: 'Asistencia a conferencia',
    advance_money: 10000,
    status: 'en curso',
    requirements: 'Boleto de avión, detalles de hospedaje',
    priority: 'Media',
    created_at: '2025-05-14T11:30:00Z',
  };

  const labels: { key: keyof typeof data; label: string }[] = [
    { key: 'id', label: 'ID solicitud' },
    { key: 'id_user', label: 'ID usuario' },
    { key: 'id_admin', label: 'ID administrador' },
    { key: 'id_origin_city', label: 'ID ciudad origen' },
    { key: 'motive', label: 'Motivo' },
    { key: 'advance_money', label: 'Anticipo' },
    { key: 'status', label: 'Estado' },
    { key: 'requirements', label: 'Requerimientos' },
    { key: 'priority', label: 'Prioridad' },
    { key: 'created_at', label: 'Fecha de creación' },
  ];

  // Handlers con Toastify
  const approve = () => {
    toast.success(`Solicitud aprobada con ${selectedAgency}`, {
      position: 'top-right',
      autoClose: 3000,
    });
    // aquí tu llamada a la API...
  };

  const requestChanges = () => {
    toast.info('Se han solicitado cambios', {
      position: 'top-right',
      autoClose: 3000,
    });
    // aquí tu llamada a la API...
  };

  const deny = () => {
    toast.error('Solicitud denegada', {
      position: 'top-right',
      autoClose: 3000,
    });
    // aquí tu llamada a la API...
  };

  return (
    <div className="pb-10">
      <main className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-10 flex flex-col">
          <Link
            to="/requests"
            className="inline-block mb-6 text-sm text-blue-600 hover:text-blue-800"
          >
            &larr; Regresar
          </Link>
          <div className="w-fit bg-[var(--blue)] text-white px-4 py-2 rounded-full mb-6">
            Información de Solicitud
          </div>
          <p className="mb-6 text-gray-700 font-medium">
            Empleado: <span className="text-[var(--blue)]">123456789</span>
          </p>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {labels.map(({ key, label }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-xs font-semibold text-gray-500 mb-1"
                >
                  {label}
                </label>
                <input
                  id={key}
                  type="text"
                  readOnly
                  value={String(data[key])}
                  className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                />
              </div>
            ))}
          </section>

          <section className="mb-10">
            <label
              htmlFor="agency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Agencias de viaje
            </label>
            <select
              id="agency"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
            >
              <option value="">-- Selecciona una agencia --</option>
            </select>
          </section>


          <section className="mb-8">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Comentarios
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tus comentarios aquí..."
            />
          </section>

          {/* Botones de acción */}
          <footer className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={approve}
              disabled={!selectedAgency}
              className={`flex-1 py-3 rounded-lg font-semibold transition
                ${
                  selectedAgency
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Aprobar
            </button>
            <button
              onClick={requestChanges}
              disabled={!comment.trim()}
              className={`flex-1 py-3 rounded-lg font-semibold transition
                ${
                  comment.trim()
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Solicitar cambios
            </button>
            <button
              onClick={deny}
              className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Denegar
            </button>
          </footer>
        </div>
      </main>

      {/* Toastify */}
      <ToastContainer />
    </div>
  );
};

export default RequestInfo;
