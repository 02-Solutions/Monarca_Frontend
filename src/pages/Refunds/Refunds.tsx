/*
 * Refunds page component, which displays a list of trips and allows users to request refunds.
 * The component includes a table of trips with an action button to request a refund.
 * When a refund is requested, a form is displayed with fields for entering details about the refund request.
 */

import { useState, useEffect } from "react";
import Table from "../../components/Refunds/Table";
import DynamicTable, {
  TableRow as DynamicTableRow,
  CellValueType,
} from "../../components/Refunds/DynamicTable";
import Button from "../../components/Refunds/Button";
import InputField from "../../components/Refunds/InputField";
import Dropdown from "../../components/Refunds/DropDown";
import { spendOptions, taxIndicatorOptions } from "./local/dummyData";
import { getRequest, postRequest } from "../../utils/apiService";

interface Trip {
  id: number | string;
  tripName: string;
  amount: number;
  date: string;
  destination: string;
  requestDate: string;
}

interface FormDataRow extends DynamicTableRow {
  spentClass: string;
  amount: number;
  taxIndicator: string;
  date: string;
  XMLFile?: File;
  PDFFile?: File;
}

// interface RefundRequest {
//   tripId: number | string;
//   expenses: FormDataRow[];
//   comment: string;
//   requestDate: string;
// }

const API_ENDPOINTS = {
  TRIPS: "https://680ff5f827f2fdac240fe541.mockapi.io/monarca/trips",
  REFUND_REQUESTS: "/monarca/refundRequests",
};

export const Refunds = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleRequestForm, setVisibleRequestForm] = useState<boolean>(false);
  const [currentRefundTrip, setCurrentRefundTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState<FormDataRow[]>([]);
  const [commentDescriptionOfSpend, setCommentDescriptionOfSpend] =
    useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRequest(API_ENDPOINTS.TRIPS);
        setTrips(response);
      } catch (err) {
        setError("Error desconocido al cargar los viajes");

        console.error(
          "Error al cargar viajes: ",
          err instanceof Error ? err.message : err
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  /*
   * Function to handle the "Comprobar" button click in the table.
   * It sets the visibleRequestForm state to true, indicating that the request form should be displayed.
   * It also sets the currentRefundTrip state to the trip object that corresponds to the clicked button.
   * This allows the form to display the details of the selected trip.
   */
  const handleRequestRefund = (tripId: string | number) => {
    setVisibleRequestForm(true);
    const trip = trips.find((trip) => trip.id === tripId);
    if (trip) {
      setCurrentRefundTrip(trip);

      /*
       * Reset the form data when a new trip is selected for refund request.
       * This ensures that the form is empty and ready for new input.
       */
      setFormData([]);
      setCommentDescriptionOfSpend("");
    }
  };

  const handleSubmitRefund = async () => {
    if (!currentRefundTrip) return;
    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);

      let i = 0;
      for (const rowData of formData) {
        const formDataToSend = new FormData();

        formDataToSend.append("tripId", currentRefundTrip.id.toString());
        formDataToSend.append("comment", commentDescriptionOfSpend);
        formDataToSend.append(
          "requestDate",
          new Date().toISOString().split("T")[0]
        );
        formDataToSend.append("spentClass", rowData.spentClass);
        formDataToSend.append("amount", rowData.amount.toString());
        formDataToSend.append("taxIndicator", rowData.taxIndicator);
        formDataToSend.append("date", rowData.date);
        if (rowData.XMLFile) {
          formDataToSend.append("XMLFile", rowData.XMLFile);
        }
        if (rowData.PDFFile) {
          formDataToSend.append("PDFFile", rowData.PDFFile);
        }

        await postRequest(API_ENDPOINTS.REFUND_REQUESTS, formDataToSend);

        i++;
        setSubmitSuccess(
          `Solicitud de reembolso ${i} enviada con éxito del viaje ${currentRefundTrip.tripName}`
        );
        console.log(
          `Solicitud de reembolso ${i} enviada con éxito de ${formData.length}`
        );
        console.log("Row submitted:");
        for (const [key, value] of formDataToSend.entries()) {
          console.log(
            `${key}: ${value instanceof File ? `File: ${value.name}` : value}`
          );
        }
      }

      setVisibleRequestForm(false);
      const updatedTrips = await getRequest(API_ENDPOINTS.TRIPS);
      setTrips(updatedTrips);
    } catch (err) {
      setSubmitError(
        "Error al enviar la solicitud de reembolso, intente nuevamente"
      );
      console.error(
        "Error al enviar la solicitud de reembolso: ",
        err instanceof Error ? err.message : err
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* Array of trip data with an action button to request a refund.
   * This is created by mapping over the tripData array and adding an action property
   * to each trip object. The action property contains a Button component that
   * calls the handleRequestRefund function when clicked.
   * The button passes the trip ID to the function, allowing it to identify
   * which trip the user is requesting a refund for.
   * The tripData array is imported from the local/dummyData file.
   */
  const dataWithActions = trips.map((trip) => ({
    ...trip,
    action: (
      <Button
        label="Comprobar"
        onClickFunction={() => handleRequestRefund(trip.id)}
      />
    ),
  }));

  /*
   * Column schema for the trips table for Table component.
   * This defines the structure of each column in the table.
   * The key property is used to access the data in the trip object,
   * and the header property is used to display the column header.
   *
   * This is the STEP ONE to understand how the table works, the key property is used to access
   * the data in the trip object, so with this form we can access the data dynamically in our object
   * data and show it in the table.
   *
   * This is passed as a prop to the Table component, which renders the table based on this schema.
   *
   */
  const columnsSchemaTrips = [
    { key: "id", header: "ID" },
    { key: "tripName", header: "Nombre del viaje" },
    { key: "date", header: "Fecha viaje" },
    { key: "destination", header: "Destino" },
    { key: "amount", header: "Monto" },
    { key: "requestDate", header: "Fecha solicitud" },
    { key: "action", header: "" },
  ];

  /*
   * Column schema for the dynamic table of expenses for the Refunds component.
   * This defines the structure of each column in the table.
   * The key property is used to access the data in the trip object,
   * and the header property is used to display the column header.
   *
   * This is passed as a prop to the DynamicTable component, which renders the table based on this schema.
   *
   * Look at the renderCell property, this is a function that helps to render custom components
   * inside the cell, this function receives a value to show in the component and a
   * function to handle the change of that component, this function is used to update
   * the component from CHILD to PARENT. Note that returns an object of type ReactNode,
   * so it should be used to render components like InputField, Dropdown, etc.
   */
  const columnsSchemaVauchers = [
    {
      key: "spentClass",
      header: "Clase de gasto",
      defaultValue: "",
      /*
       * An fast example of how the renderCell function works:
       * 1. When change the option in the dropdown, the native OnChange function of the dropdown is called.
       * 2. OnChangeComponentFunction is acually the function passed as a prop to the renderCell function,
       *    in this case (newValue) => handleFieldChange(rowIndex, column.key, newValue) in the DynamicTable component.
       * 3. This function is used to update the component from child to parent, so it will update the value of the
       *   column in the row with the new value selected in the dropdown.
       *
       */
      renderCell: (
        value: CellValueType,
        onChangeComponentFunction: (newValue: CellValueType) => void
      ) => (
        <Dropdown
          required={true}
          options={spendOptions}
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
          placeholder="Seleccione"
        />
      ),
    },
    {
      key: "amount",
      header: "Monto MXN",
      defaultValue: 0,
      renderCell: (
        value: CellValueType,
        onChangeComponentFunction: (newValue: CellValueType) => void
      ) => (
        <InputField
          required={true}
          type="number"
          value={value as string}
          onChange={(e) => onChangeComponentFunction(Number(e.target.value))}
          placeholder="Ingrese"
        />
      ),
    },
    {
      key: "taxIndicator",
      header: "Indicador de impuesto",
      defaultValue: "",
      renderCell: (
        value: CellValueType,
        onChangeComponentFunction: (newValue: CellValueType) => void
      ) => (
        <Dropdown
          required={true}
          options={taxIndicatorOptions}
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
          placeholder="Seleccione"
        />
      ),
    },
    {
      key: "date",
      header: "Fecha del comprobante",
      defaultValue: "",
      renderCell: (
        value: CellValueType,
        onChangeComponentFunction: (newValue: CellValueType) => void
      ) => (
        <InputField
          required={true}
          type="date"
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
        />
      ),
    },
    {
      key: "XML",
      header: "Archivo XML",
      defaultValue: "",
      renderCell: (
        value: CellValueType,
        onChangeComponentFunction: (newValue: CellValueType) => void,
        rowIndex?: number
      ) => (
        <InputField
          required={true}
          type="file"
          value={value as string}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onChangeComponentFunction(e.target.value);

              if (rowIndex !== undefined) {
                const updatedFormData = [...formData];
                if (updatedFormData[rowIndex]) {
                  updatedFormData[rowIndex].XMLFile = file;
                  setFormData(updatedFormData);
                }
              }
            }
          }}
          placeholder="Subir archivo XML"
        />
      ),
    },
    {
      key: "PDF",
      header: "Archivo PDF",
      defaultValue: "",
      renderCell: (
        value: CellValueType,
        onChangeComponentFunction: (newValue: CellValueType) => void,
        rowIndex?: number
      ) => (
        <InputField
          required={true}
          type="file"
          value={value as string}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onChangeComponentFunction(e.target.value);

              if (rowIndex !== undefined) {
                const updatedFormData = [...formData];
                if (updatedFormData[rowIndex]) {
                  updatedFormData[rowIndex].PDFFile = file;
                  setFormData(updatedFormData);
                }
              }
            }
          }}
          placeholder="Subir archivo PDF"
        />
      ),
    },
  ];

  const handleFormDataChange = (newData: FormDataRow[]) => {
    setFormData(newData);
    console.log("Datos del formulario actualizados:", newData);
  };

  // Wrapper function to handle the type conversion
  const handleDynamicTableDataChange = (data: DynamicTableRow[]) => {
    // Convert DynamicTableRow[] to FormDataRow[]
    handleFormDataChange(data as FormDataRow[]);
  };

  if (loading) {
    return (
      <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <p className="text-center">Cargando datos de viajes...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
        <p className="text-center text-red-500">Error: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-[#0a2c6d] text-white rounded-md hover:bg-[#0d3d94] mx-auto block"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {
        /*
         * Render the table of history trips, if the request form is not visible.
         * The table is created with the dataWithActions array, which contains
         * the trip data and the action button to request a refund.
         */

        !visibleRequestForm && (
          <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-[#0a2c6d] mb-1">
              Historial de viajes
            </h2>
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {submitSuccess}
              </div>
            )}
            {submitError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {submitError}
              </div>
            )}
            <Table
              columns={columnsSchemaTrips}
              data={dataWithActions}
              itemsPerPage={5}
            />
          </div>
        )
      }

      {
        /*
         * Render the request form, if the button to request a refund is clicked.
         * The form contains the trip information and a dynamic table
         * to add the expenses, and a obligatory comment field.
         * The dynamic table is created with the columnsSchemaVauchers array, which contains
         * the columns of the table.
         */

        visibleRequestForm && currentRefundTrip && (
          <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-[#0a2c6d] mb-1">
              Formato de solicitud de reembolso
            </h2>
            <div className="mb-4">
              {/*
               * Display general information about the trip, such as ID, name, destination,
               */}
              <h3 className="text-lg font-bold text-[#0a2c6d] mb-2">
                Información del viaje
              </h3>
              <p>
                <strong>ID del viaje:</strong> {currentRefundTrip.id}
              </p>
              <p>
                <strong>Nombre del viaje:</strong> {currentRefundTrip.tripName}
              </p>
              <p>
                <strong>Destino:</strong> {currentRefundTrip.destination}
              </p>
              <p>
                <strong>Monto total:</strong> ${currentRefundTrip.amount}
              </p>
            </div>

            {/*
             * which contains the schema of the table.
             * The table is created initially with initially empty data,
             * and the user can add new rows to the table.
             * The formData array is updated with the handleFormDataChange function,
             * which is passed as a prop to the DynamicTable component.
             * The handleFormDataChange function updates the formData state with the new data.
             */}
            <DynamicTable
              columns={columnsSchemaVauchers}
              initialData={formData}
              onDataChange={handleDynamicTableDataChange}
            />

            {/*
             * Display a field to add a comment to the refund request.
             * The comment is stored in the commentDescriptionOfSpend state,
             * and is updated with the setCommentDescriptionOfSpend function.
             */}

            <h3 className="text-lg font-bold text-[#0a2c6d] mt-4 mb-2">
              Comentario
            </h3>
            <InputField
              type="text"
              value={commentDescriptionOfSpend}
              placeholder="Ingrese un comentario"
              onChange={(e) => setCommentDescriptionOfSpend(e.target.value)}
            />

            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors hover:cursor-pointer"
                onClick={() => setVisibleRequestForm(false)}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-[#0a2c6d] text-white rounded-md hover:bg-[#0d3d94] transition-colors hover:cursor-pointer"
                onClick={() => {
                  console.log("Form data:", formData);
                  console.log("Comment:", commentDescriptionOfSpend);
                  handleSubmitRefund();
                  setVisibleRequestForm(false);
                }}
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "Enviar solicitud"}
              </button>
            </div>
          </div>
        )
      }
    </>
  );
};

export default Refunds;
