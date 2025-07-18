import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Refunds/InputField";
import TextArea from "../../components/Refunds/TextArea";
import { toast } from "react-toastify";
import { getRequest, patchRequest } from "../../utils/apiService";
import formatDate from "../../utils/formatDate";
import { postRequest } from "../../utils/apiService";
import { Tutorial } from "../../components/Tutorial";
import { useApp } from "../../hooks/app/appContext";

export const Reservations = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [request, setRequest] = useState<any>({});
  const [isFormValid, _setIsFormValid] = useState(true);
  const { handleVisitPage, tutorial } = useApp();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        // Simulate an API call to fetch data
        const response = await getRequest(`/requests/${id}`);
        setRequest({
          ...response,
          requests_destinations: response.requests_destinations.map((destination: any) => ({
            ...destination,
            origin: response.destination.city + ", " + response.destination.country,
            origin_city: response.destination.city,
            origin_country: response.destination.country,
            destination_full: destination.destination.city + ", " + destination.destination.country,
            destination_city: destination.destination.city,
            destination_country: destination.destination.country,
            departure_date: formatDate(destination.departure_date),
            arrival_date: formatDate(destination.arrival_date),
            hotel_required: destination.is_hotel_required ? "Sí" : "No",
            plane_required: destination.is_plane_required ? "Sí" : "No",
            stay_days: destination.stay_days,
            details: destination.details,
          })),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    }
    fetchRequest();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { name, files } = e.target;
    const file = files ? files[0] : null;
    const fileName = file ? file.name : "";
    
    const updatedFormData = {
      ...formData,
      [id]: {
        ...formData[id],
        [name]: file,
        // Guardar también el nombre del archivo para mostrarlo
        [`${name}_name`]: fileName,
      }
    };
    setFormData(updatedFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [id]: {
        ...formData[id],
        [name]: value,
      }
    };
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (formData === null || Object.keys(formData).length === 0) {
        toast.error("Por favor completa todos los campos requeridos.");
        return;
      }
      // Format the formData to match the API requirements
      const formattedData = {
        reservations: Object.entries(formData).flatMap(([key, value]) => {
          const hotelReservation = value.hotel_title && {
            title: value.hotel_title,
            comments: value.hotel_comments,
            price: parseFloat(value.hotel_price),
            file: value.hotel_file,
            id_request_destination: key,
          };
          const planeReservation = value.plane_title && {
            title: value.plane_title,
            comments: value.plane_comments,
            price: parseFloat(value.plane_price),
            file: value.plane_file,
            id_request_destination: key,
          };
          return [hotelReservation, planeReservation].filter(Boolean);
        }),
      };
      // Compute the length depending if each request destination has hotel or plane or both
      const hotelLength = request.requests_destinations.filter((destination: any) => destination.is_hotel_required).length;
      const planeLength = request.requests_destinations.filter((destination: any) => destination.is_plane_required).length;
      const totalLength = hotelLength + planeLength;
      if (formattedData.reservations.length !== totalLength) {
        toast.error("Por favor completa todos los campos requeridos.");
        return;
      }
      // Check if the form is valid
      const isValid = Object.values(formData).every((data, index) => {
        // Get the key of the currrent value
        const key = Object.keys(formData)[index];
        const hotelValid = data.hotel_title && data.hotel_comments && data.hotel_file;
        const planeValid = data.plane_title && data.plane_comments && data.plane_file;
        const requestDestination = request.requests_destinations.find((destination: any) => destination.id === key);
        if (!requestDestination) {
          return false;
        }
        // Check if hotel or plane is required
        if (requestDestination.is_hotel_required && requestDestination.is_plane_required) {
          return hotelValid && planeValid;
        } else if (requestDestination.is_hotel_required && !requestDestination.is_plane_required) {
          return hotelValid;
        } else if (requestDestination.is_plane_required && !requestDestination.is_hotel_required) {
          return planeValid;
        }
        return true;
      });
      if (!isValid) {
        toast.error("Por favor completa todos los campos requeridos.");
        return;
      }
      // Send the data to the API
      const responses = await Promise.all(
        formattedData.reservations.map(async (reservation) => {
          const formData = new FormData();
          formData.append("title", reservation.title);
          formData.append("comments", reservation.comments);
          formData.append("price", reservation.price);
          formData.append("file", reservation.file);
          formData.append("id_request_destination", reservation.id_request_destination);
          try {
            await postRequest("/reservations", formData);
          } catch (error) {
            console.error("Error sending data:", error);
          }
        })
      );
      if (responses) {
        toast.success("Reservaciones enviadas correctamente.");
        setFormData({});
        await patchRequest(`/requests/finished-reservations/${id}`, {});
        navigate("/dashboard");
      } else {
        toast.error("Error al enviar las reservaciones.");
      }
  }

  const labels: { key: keyof typeof request; label: string }[] = [
    { key: 'origin', label: 'Origen' },
    { key: 'destination_full', label: 'Destino' },
    { key: 'departure_date', label: 'Fecha de Salida' },
    { key: 'arrival_date', label: 'Fecha de Llegada' },
    { key: 'details', label: 'Detalles' },
    { key: 'hotel_required', label: '¿Se necesita hotel?' },
    { key: 'plane_required', label: '¿Se necesita avión?' },
    { key: 'stay_days', label: 'Días de estancia' },
  ];

  return (
    <Tutorial page="reservations" run={tutorial}>
      <div className="bg-gray-200 rounded-md mb-10 max-w-5xl mx-auto">
        <div className="p-10 mx-auto">
          <h2 className="text-2xl font-bold text-[var(--blue)] mb-4">
            Asignar reservaciones
          </h2>
          <form 
            className="space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="">
              {request?.requests_destinations?.map((destination: any) => (
                <div 
                  key={destination.id}
                  className="rounded-md p-4 mb-6 space-y-4 bg-white shadow-sm"
                >
                  <h3>Destino #{destination.destination_order}</h3>
                  <div>

                  </div>
                  <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8" id="reservation-info">
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
                          value={destination[key] || ""}
                          className="w-full bg-gray-100 text-gray-800 rounded-lg px-3 py-2 border border-gray-200"
                        />
                      </div>
                    ))}
                  </section>
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {destination.is_hotel_required && (
                      <div className="flex flex-col gap-y-4" id="hotel-reservation">
                        <h3 className="text-[var(--blue)] mb-4 font-bold">Información del hotel</h3>
                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`hotel_title_${destination.id}`}
                          >
                            Título
                          </label>
                          <Input
                            placeholder="Ingresa el título de la reservación"
                            value={formData[destination.id]?.hotel_title || ""}
                            onChange={(e) => handleChange(e, destination.id)}
                            name="hotel_title"
                            id={`hotel_title_${destination.id}`}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`hotel_comments_${destination.id}`}
                          >
                            Comentarios
                          </label>
                          <TextArea
                            placeholder="Escribe tus comentarios"
                            value={formData[destination.id]?.hotel_comments || ""}
                            onChange={(e) => handleChange(e, destination.id)}
                            name="hotel_comments"
                            id={`hotel_comments_${destination.id}`}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`hotel_price_${destination.id}`}
                          >
                            Precio
                          </label>
                          <Input
                            placeholder="Ingresa el precio del hotel"
                            value={formData[destination.id]?.hotel_price || ""}
                            onChange={(e) => handleChange(e, destination.id)}
                            name="hotel_price"
                            type="number"
                            id={`hotel_price_${destination.id}`}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`hotel_file_${destination.id}`}
                          >
                            Subir archivos de hotel
                          </label>
                          
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(e, destination.id)}
                            name="hotel_file"
                            id={`hotel_file_${destination.id}`}
                            selectedFileName={formData[destination.id]?.hotel_file_name}
                          />
                        </div>
                      </div>
                    )}
                    {destination.is_plane_required && (
                      <div className="flex flex-col gap-y-4" id="plane-reservation">
                        <h3 className="text-[var(--blue)] mb-4 font-bold">Información del vuelo</h3>
                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`plane_title_${destination.id}`}
                          >
                            Título
                          </label>
                          <Input
                            placeholder="Ingresa el título de la reservación"
                            value={formData[destination.id]?.plane_title || ""}
                            onChange={(e) => handleChange(e, destination.id)}
                            name="plane_title"
                            id={`plane_title_${destination.id}`}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`plane_comments_${destination.id}`}
                          >
                            Comentarios
                          </label>
                          <TextArea
                            placeholder="Escribe tus comentarios"
                            value={formData[destination.id]?.plane_comments || ""}
                            onChange={(e) => handleChange(e, destination.id)}
                            name="plane_comments"
                            id={`plane_comments_${destination.id}`}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`plane_price_${destination.id}`}
                          >
                            Precio
                          </label>
                          <Input
                            placeholder="Ingresa el precio del vuelo"
                            value={formData[destination.id]?.plane_price || ""}
                            onChange={(e) => handleChange(e, destination.id)}
                            name="plane_price"
                            type="number"
                            id={`plane_price_${destination.id}`}
                          />
                        </div>

                        <div>
                          <label 
                            className="block mb-2 text-sm font-medium text-gray-900"
                            htmlFor={`plane_file_${destination.id}`}
                          >
                            Subir archivos de avión
                          </label>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(e, destination.id)}
                            name="plane_file"
                            id={`plane_file_${destination.id}`}
                            selectedFileName={formData[destination.id]?.plane_file_name}
                          />
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                id="assign-reservations"
                className={`px-4 py-2 rounded-md transition-colors ${
                  isFormValid
                    ? "bg-[#0a2c6d] text-white hover:bg-[#0d3d94]"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
              >
                Enviar reservaciones
              </button>
            </div>
          </form>
        </div>
      </div>
    </Tutorial>
  );
};

export default Reservations;