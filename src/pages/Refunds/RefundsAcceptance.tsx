import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../utils/apiService";
import formatMoney from "../../utils/formatMoney";
import formatDate from "../../utils/formatDate";
import GoBack from "../../components/GoBack";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import FilePreviewer from "../../components/Refunds/FilePreviewer";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
  destination?: {
    city: string;
  };
  requests_destinations?: Array<{
    destination: {
      city: string;
    };
  }>;
  vouchers?: Array<{
    file_url_pdf: string;
    file_url_xml: string;
  }>;
}

interface Dest {
  destination: {
    city: string;
  };
}

const RefundsAcceptance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RequestData>({});
  const [_loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRequest(`/requests/${id}`);
        console.log("Response from API:", response);
        setData({
          ...response,
          createdAt: formatDate(response.createdAt),
          advance_money: formatMoney(response.advance_money),
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

  const labels: { key: keyof RequestData; label: string }[] = [
    { key: "id", label: "ID solicitud" },
    { key: "admin", label: "Aprobador" },
    { key: "id_origin_city", label: "Ciudad de Origen" },
    { key: "destinations", label: "Destinos" },
    { key: "motive", label: "Motivo" },
    { key: "advance_money", label: "Anticipo" },
    { key: "status", label: "Estado" },
    { key: "requirements", label: "Requerimientos" },
    { key: "priority", label: "Prioridad" },
    { key: "createdAt", label: "Fecha de creación" },
  ];

  return (
    <div className="pb-10">
      <GoBack />
      <main className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-10 flex flex-col">
          <div className="w-fit bg-[var(--blue)] text-white px-4 py-2 rounded-full mb-6">
            Información de Solicitud: <span>{id}</span>
          </div>
          <p className="mb-6 text-gray-700 font-medium">
            Empleado:{" "}
            <span className="text-[var(--blue)]">
              Aquí va el ID del usuario
            </span>
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
                  value={data[key] !== undefined ? String(data[key]) : ""}
                  className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                />
              </div>
            ))}
          </section>

          <div className="mb-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Comprobante de Solicitud {currentIndex + 1} de{" "}
                {data?.vouchers?.length}
              </h2>
              {/* Display the existing PDF using an iframe */}
              <Swiper
                  modules={[Navigation, Pagination]}
                  className="relative"
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
                  </SwiperSlide>
                ))}
                <div className="flex space-x-4 absolute z-10 bottom-0 right-4 bg-white">
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
              </Swiper>
            </div>
          </div>

          <div className="flex space-x-4 justify-end mt-6">
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:cursor-pointer">
              Denegar
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:cursor-pointer">
              Aprobar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RefundsAcceptance;
