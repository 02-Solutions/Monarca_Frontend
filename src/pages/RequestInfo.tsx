import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { patchRequest, postRequest } from '../utils/apiService';
import GoBack from '../components/GoBack';
import formatMoney from '../utils/formatMoney';
import formatDate from '../utils/formatDate';
import { toast } from 'react-toastify';
import { getRequest } from '../utils/apiService';
import { Permission, useAuth } from '../hooks/auth/authContext';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import FilePreviewer from '../components/Refunds/FilePreviewer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const renderStatus = (status: string) => {
  switch (status) {
    case "Pending Review":
      return "En revisión";
    case "Denied":
      return "Denegado";
    case "Cancelled":
      return "Cancelado";
      break;
    case "Changes Needed":
      return "Cambios necesarios";
      break;
    case "Pending Reservations":
      return "Reservas pendientes";
      break;
    case "Pending Accounting Approval":
      return "Contabilidad pendiente";
      break;
    case "Pending Vouchers Approval":
      return "Comprobantes pendientes";
      break;
    case "In Progress":
      return "En progreso";
      break;
    case "Completed": 
      return "Completado";
      break;
    default:
      return status;
    }
}

const RequestInfo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const [data, setData] = useState<any>({});
  const [comment, setComment] = useState('');
  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgency, setSelectedAgency] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(`/requests/${id}`);
        console.log(response);
        setData({
          ...response,
          status: renderStatus(response.status),
          createdAt: formatDate(response.createdAt),
          advance_money_str: formatMoney(response.advance_money),
          admin: response.admin.name + ' ' + response.admin.last_name,          
          id_origin_city: response.destination.city,
          destinations: response.requests_destinations.map((dest: any) => dest.destination.city).join(', '),
        });
        setSelectedAgency(response.id_travel_agency || '');
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
    { key: 'advance_money_str', label: 'Anticipo' },
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

  const cancel = async () => {
    try {
      await patchRequest(`/requests/cancel/${id}`, {});
      toast.error('Solicitud cancelada', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/history');
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Error al cancelar la solicitud', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
  };

  const register = async () => {
    try {
      await patchRequest(`/requests/SOI-approve/${id}`, {});
      toast.success('Solicitud marcada como registrada', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/history');
    } catch (error) {
      console.error('Error registering request:', error);
      toast.error('Error al marcar la solicitud como registrada', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
  }

  return (
    <div className="pb-10">
      <GoBack />
      <main className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-10 flex flex-col">
          <div className="w-fit bg-[var(--blue)] text-white px-4 py-2 rounded-full mb-6">
            Información de Solicitud: <span>{id}</span>
          </div>
          <p className="mb-6 text-gray-700 font-medium">
            Solicitante: <span className="text-[var(--blue)]">{data?.user?.name} {data?.user?.last_name}</span>
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
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Revisiones anteriores
              </p>
              <div className="grid grid-cols-1 gap-2 mb-6">
              {data?.revisions?.map((revision: any) => (
                  <div key={revision.id}>
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
              ))}
              </div>
          </section>}

          {data?.vouchers?.length > 0 && 
            <>
            <p
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comprobantes de la solicitud
              </p>
              <div className="mb-4">
            <div className="bg-white p-4 relative">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Comprobante {currentIndex + 1} de{" "}
                {data?.vouchers?.length}
              </h2>
              {/* Display the existing PDF using an iframe */}
              <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={50}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  onBeforeInit={(swiper: any) => {
                    if (typeof swiper.params.navigation !== 'boolean') {
                      swiper.params.navigation.prevEl = prevRef.current;
                      swiper.params.navigation.nextEl = nextRef.current;
                    }
                  }}
                  onSlideChange={(swiper: any) => setCurrentIndex(swiper.activeIndex)}
              >
                {data?.vouchers?.map((file: any, index: number) => (
                  <SwiperSlide key={index}>
                    <FilePreviewer 
                        file={file} 
                        fileIndex={index}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex space-x-4 absolute z-10 top-2 right-4 bg-white">
                  <button
                    ref={prevRef}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded-md hover:cursor-pointer ${
                      currentIndex === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    disabled={currentIndex === ((data?.vouchers?.length ?? 0) - 1)}
                    ref={nextRef} 
                    className={`px-4 py-2 rounded-md hover:cursor-pointer ${
                      currentIndex === (data?.vouchers?.length ?? 0) - 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Siguiente
                  </button>
              </div>
            </div>
            <section className="grid grid-cols-3 gap-5">
            <div className="my-5">
              <label
                htmlFor={"total"}
                className="block text-xs font-semibold text-gray-500 mb-1"
              >
                Total de Comprobantes
              </label>
              <input
                id={"total"}
                type="text"
                readOnly
                value={formatMoney(data?.vouchers?.reduce((acc: number, file: { status: string; amount: number }) => {
                  if (file.status === "Voucher Approved") {
                    return acc + +file.amount;
                  }
                  return acc;
                }, 0) ?? 0)}
                className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
              />
            </div>
            <div className="my-5">
              <label
                htmlFor={"advance_money"}
                className="block text-xs font-semibold text-gray-500 mb-1"
              >
                Anticipo
              </label>
              <input
                id={"advance_money"}
                type="text"
                readOnly
                value={formatMoney(Number(data?.advance_money) || 0)}
                className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
              />
            </div>
            <div className="my-5">
              <label
                htmlFor={"total"}
                className="block text-xs font-semibold text-gray-500 mb-1"
              >
                Saldo {(typeof data?.advance_money === "number" ? data.advance_money : Number(data?.advance_money) || 0) -
                  (data?.vouchers?.reduce((acc: number, file: { status: string; amount: number }) => {
                    if (file.status === "Voucher Approved") {
                      return acc + Number(file.amount);
                    }
                    return acc;
                  }, 0) ?? 0) < 0 ? "a favor" : "en contra"} 
              </label>
              <input
                id={"total"}
                type="text"
                readOnly
                value={formatMoney(
                  Math.abs((typeof data?.advance_money === "number" ? data.advance_money : Number(data?.advance_money) || 0) -
                  (data?.vouchers?.reduce((acc: number, file: { status: string; amount: number }) => {
                    if (file.status === "Voucher Approved") {
                      return acc + Number(file.amount);
                    }
                    return acc;
                  }, 0) ?? 0))
                )}
                className={`w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200
                    ${(typeof data?.advance_money === "number" ? data.advance_money : Number(data?.advance_money) || 0) -
                  (data?.vouchers?.reduce((acc: number, file: { status: string; amount: number }) => {
                    if (file.status === "Voucher Approved") {
                      return acc + Number(file.amount);
                    }
                    return acc;
                  }, 0) ?? 0) > 0 ? "text-red-500" : "text-green-600"
                }`}
              />
            </div>

            </section>
          </div>
            </>
          }

          {authState.userPermissions.includes("approve_request" as Permission) && <section className="mb-10">
            <label
              htmlFor="agency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {data.status !== "Pending Review" ? "Agencia de viaje" : "Agencias de viaje"}
            </label>
            {data.status === "Pending Review" ? (
              <select
                id="agency"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedAgency}
                disabled={data.status !== "Pending Review"}
                onChange={(e) => setSelectedAgency(e.target.value)}
              >
                <option value="">-- Selecciona una agencia --</option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                readOnly
                value={agencies?.find(agency => agency.id === data.id_travel_agency)?.name}
                className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
              />
            )}
          </section>}


          {authState.userPermissions.includes("approve_request" as Permission) && data.status === "Pending Review" && <section className="mb-8">
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
          </section>}

          {/* Botones de acción */}
          {authState.userPermissions.includes("approve_request" as Permission) &&
          <>
              {data.status === "Pending Review" &&
                <section className="mb-10">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Información importante
                  </h1>
                  <p className="text-sm text-gray-600">
                    - Para aprobar esta solicitud, debes seleccionar una agencia de viaje y proporcionar un comentario si es necesario.
                  </p>
                  <p className="text-sm text-gray-600">
                    - Si la solicitud requiere cambios, puedes solicitarlo escribiendo un comentario.
                  </p>
                  <p className="text-sm text-gray-600">
                    - Si deseas denegar la solicitud, puedes hacerlo directamente.
                  </p>
                </section>
              }
              <footer className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={approve}
                  disabled={!selectedAgency || data.status !== "Pending Review"}
                  className={`flex-1 py-3 rounded-lg font-semibold transition
                    ${
                      selectedAgency && data.status === "Pending Review"
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Aprobar
                </button>
                <button
                  onClick={requestChanges}
                  disabled={!comment.trim() || data.status !== "Pending Review"}
                  className={`flex-1 py-3 rounded-lg font-semibold transition
                    ${comment.trim() && data.status === "Pending Review"
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Solicitar cambios
                </button>
                <button
                  onClick={deny}
                  disabled={data.status !== "Pending Review"}
                  className={`flex-1 py-3 rounded-lg font-semibold transition
                    ${data.status === "Pending Review"
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Denegar
                </button>
              </footer>
          </>
          }

          {authState.userPermissions.includes("create_request" as Permission) &&
          <footer className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(`/requests/${id}/edit`)}
            disabled={data.status !== "Changes Needed"}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              data.status === "Changes Needed"
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Editar
          </button>
          <button
            onClick={cancel}
            disabled={data.status !== "Pending Review" && data.status !== "Changes Needed"}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              data.status !== "Pending Review" && data.status !== "Changes Needed"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            Cancelar
          </button>

          </footer>}

          {authState.userPermissions.includes("check_budgets" as Permission) &&
          <footer className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={register}
            disabled={data.status !== "Pending Accounting Approval"}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              data.status === "Pending Accounting Approval"
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Marcar como registrado
          </button>
          </footer>}
        </div>
      </main>
    </div>
  );
};

export default RequestInfo;
