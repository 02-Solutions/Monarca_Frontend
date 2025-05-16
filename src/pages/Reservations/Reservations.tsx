import { useState } from "react";
import DynamicTable from "../../components/Reservations/DynamicTable";
import Button from "../../components/Refunds/Button";
import { TravelAgencyFormData } from "./local/dummyData";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";


const columnsSchema = [
  { key: "id", header: "ID" },
  { key: "title", header: "Título del viaje" },
  { key: "travelDate", header: "Fecha del viaje" },
  { key: "destination", header: "Destino" },
  { key: "days", header: "Días" },
  { key: "passengers", header: "Pasajeros" },
  { key: "transport", header: "Transporte" },
  { key: "price", header: "Precio" },
  { key: "requestDate", header: "Fecha de solicitud" },
  { key: "status", header: "Estado" },
  { key: "action", header: "" },
];

export const Reservations = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const togglePopup = () => setShowPopup(!showPopup);

  const isFormValid = title.trim() !== "" && comments.trim() !== "" && files?.length;

  const dataWithActions = TravelAgencyFormData.map((record) => ({
    ...record,
    action: (
      <Button
        label="Asignar reservación"
        onClickFunction={togglePopup}
      />
    ),
  }));

  return (
    <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-[#0a2c6d] mb-4">
        Reservaciones pendientes
      </h2>
      <DynamicTable columns={columnsSchema} initialData={dataWithActions}/>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] relative border border-gray-300">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Asignar reservación</h3>
              <button
                onClick={togglePopup}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6 bg-gray-100">
              <form className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Título
                  </label>
                  <Input
                    placeholder="Ingresa el título de la reservación"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Comentarios
                  </label>
                  <TextArea
                    rows={4}
                    placeholder="Escribe tus comentarios"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Subir archivos
                  </label>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      isFormValid
                        ? "bg-[#0a2c6d] text-white hover:bg-[#0d3d94]"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
