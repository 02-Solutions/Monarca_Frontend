import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../../utils/apiService";
import formatMoney from "../../utils/formatMoney";
import formatDate from "../../utils/formatDate";
import GoBack from "../../components/GoBack";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import FilePreviewer from "../../components/Refunds/FilePreviewer";
import { patchRequest } from "../../utils/apiService";
import { Tutorial } from "../../components/Tutorial";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { toast } from "react-toastify";
import { useApp } from "../../hooks/app/appContext";

interface RequestData {
  id?: string;
  admin?: string;
  id_origin_city?: string;
  destinations?: string;
  motive?: string;
  advance_money?: string | number;
  status?: string;
  requirements?: string;
  priority?: string;
  createdAt?: string;
  advance_money_str?: string;
  destination?: {
    city: string;
  };
  requests_destinations?: Array<{
    destination: {
      city: string;
    };
  }>;
  vouchers?: Array<{
    id: string;
    file_url_pdf: string;
    file_url_xml: string;
    status: string;
    class: string;
    amount: number;
    date: string;
  }>;
}

interface Dest {
  destination: {
    city: string;
  };
}

export const renderStatus = (status: string) => {
  let statusText = "";
  switch (status) {
    case "Pending Review":
      statusText = "En revisión";
      break;
    case "Denied":
      statusText = "Denegado";
      break;
    case "Cancelled":
      statusText = "Cancelado";
      break;
    case "Changes Needed":
      statusText = "Cambios necesarios";
      break;
    case "Pending Reservations":
      statusText = "Reservas pendientes";
      break;
    case "Pending Accounting Approval":
      statusText = "Contabilidad pendiente";
      break;
    case "Pending Vouchers Approval":
      statusText = "Comprobantes pendientes";
      break;
    case "In Progress":
      statusText = "En progreso";
      break;
    case "Pending Refund Approval": 
      statusText = "Reembolso pendiente";
      break;
    case "Completed": 
      statusText = "Completado";
      break;
    default:
      statusText = status;
    }
    return (
      statusText
    )
}

const RefundsAcceptance: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RequestData>({});
  const [_loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const { handleVisitPage, tutorial } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRequest(`/requests/${id}`);
        console.log("Response from API:", response);
        setData({
          ...response,
          createdAt: formatDate(response.createdAt),
          advance_money_str: formatMoney(response.advance_money),
          admin: response.admin.name + " " + response.admin.last_name,
          id_origin_city: response.destination.city,
          destinations: response.requests_destinations
            .map((dest: Dest) => dest.destination.city)
            .join(", "),
        });
      } catch (error) {
        console.error("Error fetching request data:", error);
      } finally {
        setLoading(false);
        console.log("Data fetched successfully");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
      // Get the visited pages from localStorage
      const visitedPages = JSON.parse(localStorage.getItem("visitedPages") || "[]");
      // Check if the current page is already in the visited pages
      const isPageVisited = visitedPages.includes(location.pathname);
  
      // If the page is not visited, set the tutorial to true
      if (!isPageVisited) {
        // setTutorial(true);
      }
      // Add the current page to the visited pages
      handleVisitPage();
    }, []);

  const labels: { key: keyof RequestData; label: string }[] = [
    { key: "id", label: "ID solicitud" },
    { key: "admin", label: "Aprobador" },
    { key: "id_origin_city", label: "Ciudad de Origen" },
    { key: "destinations", label: "Destinos" },
    { key: "motive", label: "Motivo" },
    { key: "advance_money_str", label: "Anticipo" },
    { key: "status", label: "Estado" },
    { key: "requirements", label: "Requerimientos" },
    { key: "priority", label: "Prioridad" },
    { key: "createdAt", label: "Fecha de creación" },
  ];

  const approveVoucher = async (id: string) => {
    try {
      await patchRequest(`/vouchers/${id}/approve`, {});
      const updatedVouchers = data?.vouchers?.map((voucher) => {
        if (voucher.id === id) {
          return { ...voucher, status: "comprobante_aprobado" };
        }
        return voucher;
      });
      setData({ ...data, vouchers: updatedVouchers });
    }
    catch (error) { 
      console.error("Error approving voucher:", error);
    }
  }

  const denyVoucher = async (id: string) => {
    try {
      await patchRequest(`/vouchers/${id}/deny`, {});
      const updatedVouchers = data?.vouchers?.map((voucher) => {
        if (voucher.id === id) {
          return { ...voucher, status: "comprobante_rechazado" };
        }
        return voucher;
      });
      setData({ ...data, vouchers: updatedVouchers });
    } catch (error) {
      console.error("Error denying voucher:", error);
    }
  } 

  const completeRequest = async () => {
    try {
      await patchRequest(`/requests/finished-approving-vouchers/${id}`, {});
      toast.success("Comprobación de solicitud completada");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error completing request:", error);
    }
  };

  return (
    <Tutorial page="refundReview" run={tutorial}>
      <div className="pb-10">
        <GoBack />
        <main className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden">
          <div className="px-8 py-10 flex flex-col">
            <div className="w-fit bg-[var(--blue)] text-white px-4 py-2 rounded-full mb-6">
              Información de Solicitud: <span>{id}</span>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8" id="request-info">
              {labels.map(({ key, label }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-xs font-semibold text-gray-500 mb-1"
                  >
                    {label}
                  </label>

                {key === 'status' ? (
                    <input
                    id={key}
                    type="text"
                    readOnly
                    value={data[key] !== undefined ? String(renderStatus(data.status ?? '')) : ""}
                    className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                  />
                  
                ) : (
                  <input
                    id={key}
                    type="text"
                    readOnly
                    value={data[key] !== undefined ? String(data[key]) : ""}
                    className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                  />
                )}
                </div>
              ))}
            </section>


            <div className="mb-4">
              <div className="bg-white p-4 rounded-lg shadow-md relative" id="vouchers">
                <section className="mb-10">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Información importante
                  </h1>
                  <p className="text-sm text-gray-600">
                    - Se debe aprobar o denegar individualmente cada uno de los comprobantes
                  </p>
                  <p className="text-sm text-gray-600">
                    - Al finalizar la aprobación de comprobantes, se debe dar click en el botón "Completar Comprobación"
                  </p>
                </section>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Comprobante de Solicitud {currentIndex + 1} de{" "}
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
                  {data?.vouchers?.map((file, index) => (
                    <SwiperSlide key={index}>
                      <FilePreviewer 
                          file={file} 
                          fileIndex={index}
                      />
                      <div className="flex space-x-4 justify-end mt-6 absolute z-50 bottom-0 right-4">
                          <button 
                            disabled={file?.status !== "comprobante_pendiente"}
                            className={`px-4 py-2 text-white rounded-md  hover:cursor-pointer 
                              ${file?.status !== "comprobante_pendiente" 
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                              }`}
                              onClick={() => denyVoucher(file?.id)}
                            id="deny-button"
                          >
                              Denegar
                          </button>
                          <button 
                              disabled={file?.status !== "comprobante_pendiente"}
                              className={`px-4 py-2  text-white rounded-md  hover:cursor-pointer
                                ${file?.status !== "comprobante_pendiente"
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                                }`}
                              onClick={() => approveVoucher(file?.id)}
                              id="approve-button"
                            >
                              Aprobar
                          </button>
                      </div>
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
                      id="next-voucher"
                    >
                      Siguiente
                    </button>
                </div>
              </div>
              <section className="grid grid-cols-3 gap-5" id="refund-review">
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
                    if (file.status === "comprobante_aprobado") {
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
                  Total
                </label>
                <input
                  id={"total"}
                  type="text"
                  readOnly
                  value={formatMoney(
                    (data?.vouchers?.reduce((acc: number, file: { status: string; amount: number }) => {
                      if (file.status === "comprobante_aprobado") {
                        return acc + Number(file.amount);
                      }
                      return acc;
                    }, 0) ?? 0) + (typeof data?.advance_money === "number" ? data.advance_money : Number(data?.advance_money) || 0)
                  )}
                  className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                />
              </div>

              </section>

              <div className="flex space-x-4 justify-end mt-6">
                  <button 
                    className={`px-4 py-2 text-white rounded-md hover:cursor-pointer 
                      ${data?.vouchers?.some((file) => file.status === "comprobante_pendiente")
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[var(--blue)] hover:bg-[var(--dark-blue)]"
                      }`}
                    disabled={data?.vouchers?.some((file) => file.status === "comprobante_pendiente")}
                    onClick={completeRequest}
                    id="complete-refund"
                  >
                      Completar Comprobación
                  </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Tutorial>
  );
};

export default RefundsAcceptance;
