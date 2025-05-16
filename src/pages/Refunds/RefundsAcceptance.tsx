/*
 * Refunds page component, which displays a list of trips and allows users to request refunds.
 * The component includes a table of trips with an action button to request a refund.
 * When a refund is requested, a form is displayed with fields for entering details about the refund request.
 */

import { useState } from "react";
import Table from "../../components/Refunds/Table";
import Button from "../../components/Refunds/Button";
//import InputField from "../../components/Refunds/InputField";
//import Dropdown from "../../components/Refunds/DropDown";
import { tripData} from "./local/dummyData";

export const RefundsAcceptance = () => {
  /*
   * State to manage the visibility of the request form and the current trip
   * for which the refund is being requested.
   */
  const [visibleRequestForm] = useState(false);

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

  const [currentRefundTrip ] = useState<Trip | null>(null);

  /*
   * State to manage the form data for the refund request.
   * This is an array of objects, each object represents a row in the dynamic table
   * for entering expenses related to the refund request.
   */
  //interface FormDataRow {
    //spentClass: string;
    //amount: number;
    //taxIndicator: string;
    //date: string;
    //XML: string;
    //PDF: string;
    //[key: string]: string | number | null | undefined | ReactNode;
  //}


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
        label="Ver Comprobante"
        onClickFunction={() => void(trip.id)}
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
  //const columnsSchemaVauchers = [
    //{
      //key: "spentClass",
      //header: "Clase de gasto",
      //defaultValue: "",
      ///*
       //* An fast example of how the renderCell function works:
       //* 1. When change the option in the dropdown, the native OnChange function of the dropdown is called.
       //* 2. OnChangeComponentFunction is acually the function passed as a prop to the renderCell function,
       //*    in this case (newValue) => handleFieldChange(rowIndex, column.key, newValue) in the DynamicTable component.
       //* 3. This function is used to update the component from child to parent, so it will update the value of the
       //*   column in the row with the new value selected in the dropdown.
       //*
       //*/
      //renderCell: (
        //value: ReactNode,
        //onChangeComponentFunction: (newValue: ReactNode) => void
      //) => (
        //<Dropdown
          //required={true}
          //options={spendOptions}
          //value={value as string}
          //onChange={(e) => onChangeComponentFunction(e.target.value)}
          //placeholder="Seleccione el tipo de gasto"
        ///>
      //),
    //},
    //{
      //key: "amount",
      //header: "Monto MXN",
      //defaultValue: 0,
      //renderCell: (
        //value: ReactNode,
        //onChangeComponentFunction: (newValue: ReactNode) => void
      //) => (
        //<InputField
          //required={true}
          //type="number"
          //value={value as string}
          //onChange={(e) => onChangeComponentFunction(Number(e.target.value))}
          //placeholder="Ingrese monto del comprobante"
        ///>
      //),
    //},
    //{
      //key: "taxIndicator",
      //header: "Indicador de impuesto",
      //defaultValue: "",
      //renderCell: (
        //value: ReactNode,
        //onChangeComponentFunction: (newValue: ReactNode) => void
      //) => (
        //<Dropdown
          //required={true}
          //options={taxIndicatorOptions}
          //value={value as string}
          //onChange={(e) => onChangeComponentFunction(e.target.value)}
          //placeholder="Seleccione el indicador de impuesto"
        ///>
      //),
    //},
    //{
      //key: "date",
      //header: "Fecha del comprobante",
      //defaultValue: "",
      //renderCell: (
        //value: ReactNode,
        //onChangeComponentFunction: (newValue: ReactNode) => void
      //) => (
        //<InputField
          //required={true}
          //type="date"
          //value={value as string}
          //onChange={(e) => onChangeComponentFunction(e.target.value)}
          //placeholder="Fecha del comprobante"
        ///>
      //),
    //},
    //{
      //key: "XML",
      //header: "Archivo XML",
      //defaultValue: "",
      //renderCell: (
        //value: ReactNode,
        //onChangeComponentFunction: (newValue: ReactNode) => void
      //) => (
        //<InputField
          //required={true}
          //type="file"
          //value={value as string}
          //onChange={(e) => onChangeComponentFunction(e.target.value)}
          //placeholder="Subir archivo XML"
        ///>
      //),
    //},
    //{
      //key: "PDF",
      //header: "Archivo PDF",
      //defaultValue: "",
      //renderCell: (
        //value: ReactNode,
        //onChangeComponentFunction: (newValue: ReactNode) => void
      //) => (
        //<InputField
          //required={true}
          //type="file"
          //value={value as string}
          //onChange={(e) => onChangeComponentFunction(e.target.value)}
          //placeholder="Subir archivo PDF"
        ///>
      //),
    //},
  //];

  // Import the TableRow type or define it locally if not already imported
  //interface TableRow {
    //[key: string]: string | number | null | undefined | ReactNode;
  //}

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
          </div>
        )
      }
    </>
  );
};

export default RefundsAcceptance;
