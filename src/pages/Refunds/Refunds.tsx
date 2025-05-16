/*
 * Refunds page component, which displays a list of trips and allows users to request refunds.
 * The component includes a table of trips with an action button to request a refund.
 * When a refund is requested, a form is displayed with fields for entering details about the refund request.
 */

import { useState, ReactNode } from "react";
import Table from "../../components/Refunds/Table";
import DynamicTable from "../../components/Refunds/DynamicTable";
import Button from "../../components/Refunds/Button";
import InputField from "../../components/Refunds/InputField";
import Dropdown from "../../components/Refunds/DropDown";
import { tripData, spendOptions, taxIndicatorOptions } from "./local/dummyData";

export const Refunds = () => {
  /*
   * State to manage the visibility of the request form and the current trip
   * for which the refund is being requested.
   */
  const [visibleRequestForm, setVisibleRequestForm] = useState(false);

  /*
   * State to manage the current trip for which the refund is being requested.
   * This is set when the user clicks the action button in the table.
   */
  interface Trip {
    id: number | string;
    tripName: string;
    amount: number;
    status: string;
    date: string;
    destination: string;
    duration: number;
    passengers: number;
    transportation: string;
    requestDate: string;
  }

  const [currentRefundTrip, setCurrentRefundTrip] = useState<Trip | null>(null);

  /*
   * State to manage the form data for the refund request.
   * This is an array of objects, each object represents a row in the dynamic table
   * for entering expenses related to the refund request.
   */
  interface FormDataRow {
    spentClass: string;
    amount: number;
    taxIndicator: string;
    date: string;
    XML: string;
    PDF: string;
    [key: string]: string | number | null | undefined | ReactNode;
  }

  const [formData, setFormData] = useState<FormDataRow[]>([]);

  /*
   * State to manage the comment field for the refund request.
   * This is a string that contains the comment entered by the user.
   */
  const [commentDescriptionOfSpend, setCommentDescriptionOfSpend] =
    useState("");

  /*
   * Function to handle the "Comprobar" button click in the table.
   * It sets the visibleRequestForm state to true, indicating that the request form should be displayed.
   * It also sets the currentRefundTrip state to the trip object that corresponds to the clicked button.
   * This allows the form to display the details of the selected trip.
   */
  const handleRequestRefund = (tripId: string | number) => {
    setVisibleRequestForm(true);
    const trip = tripData.find((trip) => trip.id === tripId);
    if (trip) {
      setCurrentRefundTrip(trip);

      /*
       * Reset the form data when a new trip is selected for refund request.
       * This ensures that the form is empty and ready for new input.
       */
      setFormData([]);
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
  const dataWithActions = tripData.map((trip) => ({
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
    { key: "duration", header: "Días" },
    { key: "passengers", header: "Pasajeros" },
    { key: "transportation", header: "Transporte" },
    { key: "amount", header: "Monto" },
    { key: "requestDate", header: "Fecha solicitud" },
    { key: "status", header: "Estado" },
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
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChangeComponentFunction: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <Dropdown
          required={true}
          options={spendOptions}
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
          placeholder="Seleccione el tipo de gasto"
        />
      ),
    },
    {
      key: "amount",
      header: "Monto MXN",
      defaultValue: 0,
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChangeComponentFunction: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField
          required={true}
          type="number"
          value={value as string}
          onChange={(e) => onChangeComponentFunction(Number(e.target.value))}
          placeholder="Ingrese monto del comprobante"
        />
      ),
    },
    {
      key: "taxIndicator",
      header: "Indicador de impuesto",
      defaultValue: "",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChangeComponentFunction: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <Dropdown
          required={true}
          options={taxIndicatorOptions}
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
          placeholder="Seleccione el indicador de impuesto"
        />
      ),
    },
    {
      key: "date",
      header: "Fecha del comprobante",
      defaultValue: "",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChangeComponentFunction: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField
          required={true}
          type="date"
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
          placeholder="Fecha del comprobante"
        />
      ),
    },
    {
      key: "XML",
      header: "Archivo XML",
      defaultValue: "",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChangeComponentFunction: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField
          required={true}
          type="file"
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
          placeholder="Subir archivo XML"
        />
      ),
    },
    {
      key: "PDF",
      header: "Archivo PDF",
      defaultValue: "",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChangeComponentFunction: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField
          required={true}
          type="file"
          value={value as string}
          onChange={(e) => onChangeComponentFunction(e.target.value)}
          placeholder="Subir archivo PDF"
        />
      ),
    },
  ];

  // Import the TableRow type or define it locally if not already imported
  interface TableRow {
    [key: string]: string | number | null | undefined | ReactNode;
  }

  const handleFormDataChange = (newData: FormDataRow[]) => {
    setFormData(newData);
    console.log("Datos del formulario actualizados:", newData);
  };

  // Wrapper function to handle the type conversion
  const handleDynamicTableDataChange = (data: TableRow[]) => {
    // Convert TableRow[] to FormDataRow[]
    const formDataRows = data as unknown as FormDataRow[];
    handleFormDataChange(formDataRows);
  };

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
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-[#0a2c6d] text-white rounded-md hover:bg-[#0d3d94] transition-colors hover:cursor-pointer"
                onClick={() => {
                  console.log("Form data:", formData);
                  console.log("Comment:", commentDescriptionOfSpend);
                  setVisibleRequestForm(false);
                }}
              >
                Enviar solicitud
              </button>
            </div>
          </div>
        )
      }
    </>
  );
};

export default Refunds;
