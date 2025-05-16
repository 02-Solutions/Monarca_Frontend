import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormularioSolicitudViaje: React.FC = () => {
  // Estados
  const [comentario, setComentario] = useState('');
  const [agenciaSeleccionada, setAgenciaSeleccionada] = useState('');

  // Datos de ejemplo (normalmente vendrían por props o fetch)
  const datos = {
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

  // Etiquetas en español y orden deseado
  const etiquetas: { key: keyof typeof datos; label: string }[] = [
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
  const aprobar = () => {
    toast.success(`Solicitud aprobada con ${agenciaSeleccionada}`, {
      position: 'top-right',
      autoClose: 3000,
    });
    // aquí tu llamada a la API...
  };

  const solicitarCambios = () => {
    toast.info('Se han solicitado cambios', {
      position: 'top-right',
      autoClose: 3000,
    });
    // aquí tu llamada a la API...
  };

  const denegar = () => {
    toast.error('Solicitud denegada', {
      position: 'top-right',
      autoClose: 3000,
    });
    // aquí tu llamada a la API...
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <main className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-10">
          {/* Título sección */}
          <div className="inline-block bg-blue-700 text-white px-4 py-2 rounded-full mb-6">
            Información de Solicitud
          </div>

          {/* Empleado */}
          <p className="mb-6 text-gray-700 font-medium">
            Empleado: <span className="text-blue-800">123456789</span>
          </p>

          {/* Zona de comentarios */}
          <section className="mb-8">
            <label
              htmlFor="comentario"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Comentarios
            </label>
            <textarea
              id="comentario"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tus comentarios aquí..."
            />
          </section>

          {/* Campos de datos */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {etiquetas.map(({ key, label }) => (
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
                  value={String(datos[key])}
                  className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                />
              </div>
            ))}
          </section>

          {/* Dropdown de agencias */}
          <section className="mb-10">
            <label
              htmlFor="agencia"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Agencias de viaje
            </label>
            <select
              id="agencia"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={agenciaSeleccionada}
              onChange={(e) => setAgenciaSeleccionada(e.target.value)}
            >
              <option value="">-- Selecciona una agencia --</option>
              <option value="Viajes Méndez">Viajes Méndez</option>
              <option value="Turismo Express">Turismo Express</option>
              <option value="Ruta Latina">Ruta Latina</option>
            </select>
          </section>

          {/* Botones de acción */}
          <footer className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={aprobar}
              disabled={!agenciaSeleccionada}
              className={`flex-1 py-3 rounded-lg font-semibold transition
                ${
                  agenciaSeleccionada
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Aprobar
            </button>
            <button
              onClick={solicitarCambios}
              disabled={!comentario.trim()}
              className={`flex-1 py-3 rounded-lg font-semibold transition
                ${
                  comentario.trim()
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Solicitar cambios
            </button>
            <button
              onClick={denegar}
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

export default FormularioSolicitudViaje;
