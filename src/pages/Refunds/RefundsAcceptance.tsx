import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../utils/apiService";
import formatMoney from "../../utils/formatMoney";
import formatDate from "../../utils/formatDate";
import GoBack from "../../components/GoBack";

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
}

interface Dest {
  destination: {
    city: string;
  };
}

interface FileUrlPair {
  pdfUrl: string;
  xmlUrl: string;
}

const RefundsAcceptance: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<RequestData>({});
  const [loading, setLoading] = useState(true);
  const [fileUrls, setFileUrls] = useState<FileUrlPair[]>([
    {
      pdfUrl:
        "http://localhost:3000/files/vouchers/334_LRA960318EK1_22-Nov-23.pdf",
      xmlUrl:
        "http://localhost:3000/files/vouchers/334_LRA960318EK1_22-Nov-23.xml",
    },
    {
      pdfUrl:
        "http://localhost:3000/files/vouchers/333_LRA960318EK1_21-Nov-23.pdf",
      xmlUrl:
        "http://localhost:3000/files/vouchers/334_LRA960318EK1_22-Nov-23.xml",
    },
    {
      pdfUrl:
        "http://localhost:3000/files/vouchers/333_LRA960318EK1_21-Nov-23.pdf",
      xmlUrl:
        "http://localhost:3000/files/vouchers/334_LRA960318EK1_22-Nov-23.xml",
    },
  ]);

  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Get the current file based on the index
  const currentFile = fileUrls[currentFileIndex] || {
    pdfUrl: "",
    xmlUrl: "",
  };

  useEffect(() => {
    const fetchFileUrls = async () => {
      try {
        // Example implementation:
        // const response = await getRequest(`/requests/${id}/files`);
        // setFileUrls(response.fileUrls);
        console.log("File URLs would be fetched here");
      } catch (error) {
        console.error("Error fetching file URLs:", error);
      }
    };

    fetchFileUrls();
  }, [id]);

  const changeFile = (index: number) => {
    if (index < 0) {
      setCurrentFileIndex(0);
    } else if (index >= fileUrls.length) {
      setCurrentFileIndex(fileUrls.length - 1);
    } else {
      setCurrentFileIndex(index);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRequest(`/requests/${id}`);
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
      <main className="max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="px-8 py-10 flex flex-col">
          <GoBack />
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
                Comprobante de Solicitud {currentFileIndex + 1} de{" "}
                {fileUrls.length}
              </h2>
              {/* Display the existing PDF using an iframe */}
              <div className="w-full h-96 mb-4">
                <iframe
                  src={currentFile.pdfUrl}
                  width="100%"
                  height="100%"
                  title={`Comprobante de Solicitud ${currentFileIndex + 1}`}
                  className="border-0"
                />
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-4">
                  <a
                    href={currentFile.xmlUrl}
                    download={`comprobante${currentFileIndex + 1}.xml`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer"
                  >
                    Descargar XML
                  </a>
                  <a
                    href={currentFile.pdfUrl}
                    download={`comprobante${currentFileIndex + 1}.pdf`}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 hover:cursor-pointer"
                  >
                    Descargar PDF
                  </a>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => changeFile(currentFileIndex - 1)}
                    disabled={currentFileIndex === 0}
                    className={`px-4 py-2 rounded-md hover:cursor-pointer ${
                      currentFileIndex === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => changeFile(currentFileIndex + 1)}
                    disabled={currentFileIndex === fileUrls.length - 1}
                    className={`px-4 py-2 rounded-md hover:cursor-pointer ${
                      currentFileIndex === fileUrls.length - 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
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
