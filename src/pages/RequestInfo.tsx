import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { patchRequest, postRequest } from '../utils/apiService';
import GoBack from '../components/GoBack';
import formatMoney from '../utils/formatMoney';
import formatDate from '../utils/formatDate';
import { toast } from 'react-toastify';
import { getRequest } from '../utils/apiService';
import { useAuth } from '../hooks/auth/authContext';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const RequestInfo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const [data, setData] = useState<any>({});
  const [comment, setComment] = useState('');
  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgency, setSelectedAgency] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(`/requests/${id}`);
        setData({
          ...response,
          createdAt: formatDate(response.createdAt),
          advance_money: formatMoney(response.advance_money),
          admin: response.admin.name + ' ' + response.admin.last_name,          
          id_origin_city: response.destination.city,
          destinations: response.requests_destinations.map((dest: any) => dest.destination.city).join(', '),
        });
      } catch (error) {
        console.error('Error fetching request data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await getRequest('/travel-agencies');
        setAgencies(response);
      } catch (error) {
        console.error('Error fetching agencies data:', error);
      }
    };

    fetchAgencies();
  }, []);

  const labels: { key: keyof typeof data; label: string }[] = [
    { key: 'id', label: 'ID solicitud' },
    { key: 'admin', label: 'Aprobador' },
    { key: 'id_origin_city', label: 'Ciudad de Origen' },
    { key: 'destinations', label: 'Destinos' },
    { key: 'motive', label: 'Motivo' },
    { key: 'advance_money', label: 'Anticipo' },
    { key: 'status', label: 'Estado' },
    { key: 'requirements', label: 'Requerimientos' },
    { key: 'priority', label: 'Prioridad' },
    { key: 'createdAt', label: 'Fecha de creación' },
  ];

  const approve = async () => {
    if (!selectedAgency) {
      toast.error('Selecciona una agencia de viaje', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try{
      await patchRequest(`/requests/approve/${id}`, {
        id_travel_agency: selectedAgency,
      });
      toast.success(`Solicitud aprobada con ${selectedAgency}`, {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/approvals');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Error al aprobar la solicitud', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
  };

  const requestChanges = async () => {
    if (!comment.trim()) {
      toast.error('Escribe un comentario para solicitar cambios', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      await postRequest(`/revisions`, {
        id_request: id,
        comment: comment,
      });
      toast.info('Se han solicitado cambios', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/approvals');
    } catch (error) {
      console.error('Error requesting changes:', error);
      toast.error('Error al solicitar cambios', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
  };

  const deny = async () => {
    try {
      await patchRequest(`/requests/deny/${id}`, {});
      toast.error('Solicitud denegada', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/approvals');
    } catch (error) {
      console.error('Error denying request:', error);
      toast.error('Error al denegar la solicitud', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
  };

  return (
    <div className="pb-10">
      <main className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-10 flex flex-col">
          <GoBack />
          <div className="w-fit bg-[var(--blue)] text-white px-4 py-2 rounded-full mb-6">
            Información de Solicitud: <span>{id}</span>
          </div>
          <p className="mb-6 text-gray-700 font-medium">
            Empleado: <span className="text-[var(--blue)]">{authState.userId}</span>
          </p>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {labels.map(({ key, label }) => (
              <div key={key as string}>
                <label
                  htmlFor={key as string}
                  className="block text-xs font-semibold text-gray-500 mb-1"
                >
                  {label}
                </label>
                <input
                  id={key as string}
                  type="text"
                  readOnly
                  value={String(data[key])}
                  className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                />
              </div>
            ))}
          </section>

          <section>
              <p
                className="block text-sm font-medium text-gray-700 mb-4"
              >
                Detalles de los destinos
              </p>
              {data?.requests_destinations?.map((dest: any) => (
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8" key={dest.id}>
                    <div>
                      <label
                        className="block text-xs font-semibold text-gray-500 mb-1"
                      >
                        Lugar
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={dest.destination.city}
                        className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-semibold text-gray-500 mb-1"
                      >
                        Fecha de salida
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatDate(dest.departure_date)}
                        className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-semibold text-gray-500 mb-1"
                      >
                        Fecha de llegada
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatDate(dest.arrival_date)}
                        className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-xs font-semibold text-gray-500 mb-1"
                      >
                        Detalles
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={dest.details}
                        className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                      />
                    </div>
                    <div className="flex items-center justify-start gap-1">
                        {dest.is_hotel_required && (
                          <p className='text-sm bg-[var(--yellow)] rounded-full px-2 py-1 w-fit'>Hotel</p>
                        )}
                        {dest.is_plane_required && (
                          <p className='text-sm bg-[var(--blue)] text-[var(--white)] rounded-full px-2 py-1 w-fit'>Avión</p>
                        )}
                        {dest.stay_days && (
                          <p className='text-sm bg-[var(--green)] text-[var(--white)] rounded-full px-2 py-1 w-fit'>{dest.stay_days} días</p>
                        )}
                      
                    </div>
                  </div>
              ))}
          </section>

          {data?.revisions?.length > 0 && <section>
              <p
                className="block text-sm font-medium text-gray-700 mb-4"
              >
                Revisiones anteriores
              </p>
              {data?.revisions?.map((revision: any) => (
                  <div className="grid grid-cols-1 gap-3 mb-8" key={revision.id}>
                    <div>
                      <label
                        className="block text-xs font-semibold text-gray-500 mb-1"
                      >
                        Comentario
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={revision.comment}
                        className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                      />
                    </div>
                  </div>
              ))}
          </section>}

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
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
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
    </div>
  );
};

export default RequestInfo;
