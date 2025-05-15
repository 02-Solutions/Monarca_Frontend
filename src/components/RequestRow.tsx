/**
 * @file RequestRow.tsx
 * @description Vista de solicitudes de viaje con tabla editable, dropdowns, inputs y acciones.
 * @lastEdited 2025-05-14
 * @author Isaac
 */

import { useState, ReactNode } from "react";
import Button from "../components/Refunds/Button";
import DynamicTable from "../components/Refunds/DynamicTable";
import InputField from "../components/Refunds/InputField";
import Dropdown from "../components/Refunds/DropDown";
import { FaSyncAlt } from "react-icons/fa";

// Define types for dropdown options
type DropdownOption = {
  value: string;
  label: string;
};

// Define type for travel request data
interface TravelRequest {
  id: string;
  date: string;
  city: string;
  country: string;
  reason: string;
  status: "autorizado" | "pendiente";
  settlement: string;
  refund: string;
  currency: "MXN" | "USD";
}

// Import TableRow interface to match DynamicTable's expectations
interface TableRow {
  [key: string]: string | number | boolean | null | undefined | ReactNode;
}

// Options del dropdown para campo de estado
const STATUS_OPTIONS: DropdownOption[] = [
  { value: "autorizado", label: "Autorizado" },
  { value: "pendiente", label: "Pendiente" },
];

// Options del dropdown para campo de moneda
const MONEDA_OPTIONS: DropdownOption[] = [
  { value: "MXN", label: "MXN" },
  { value: "USD", label: "USD" },
];

/**
 * Componente principal que renderiza una tabla editable con datos de viajes,
 * campos de entrada editables, controles de paginación y metainformación del empleado.
 */
const RequestRow = () => {
  // Estado para almacenar los datos de cada fila de la tabla
  const [data, setData] = useState<TravelRequest[]>([
    {
      id: "0001",
      date: "14/09/2020",
      city: "Cancún",
      country: "MX",
      reason: "Viaje",
      status: "autorizado",
      settlement: "A liquidar",
      refund: "$100",
      currency: "MXN",
    },
    {
      id: "0002",
      date: "14/09/2020",
      city: "CDMX",
      country: "MX",
      reason: "Auditoría",
      status: "autorizado",
      settlement: "Comprobado",
      refund: "$200",
      currency: "MXN",
    },
  ]);

  // Column config that matches DynamicTable's Column interface
  const columns = [
    {
      key: "status",
      header: "Autorización",
      defaultValue: "pendiente",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <Dropdown
          value={value as string}
          options={STATUS_OPTIONS}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "id",
      header: "Viaje",
      defaultValue: "",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <InputField
          value={value as string}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "date",
      header: "Fecha Salida",
      defaultValue: "",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <InputField
          type="date"
          value={value as string}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "city",
      header: "Población",
      defaultValue: "",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <InputField
          value={value as string}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "country",
      header: "País",
      defaultValue: "MX",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <InputField
          value={value as string}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "reason",
      header: "Razón",
      defaultValue: "",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <InputField
          value={value as string}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "settlement",
      header: "Comprobación",
      defaultValue: "",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <InputField
          value={value as string}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "refund",
      header: "Reembolso",
      defaultValue: "$0",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <InputField
          value={value as string}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
    {
      key: "currency",
      header: "Moneda",
      defaultValue: "MXN",
      renderCell: (value: any, handleFieldChange: (newValue: any) => void) => (
        <Dropdown
          value={value as string}
          options={MONEDA_OPTIONS}
          onChange={(e) => handleFieldChange(e.target.value)}
        />
      ),
    },
  ];

  // Handle data changes from DynamicTable
  const handleDataChange = (newData: TableRow[]) => {
    // Cast the TableRow[] to TravelRequest[] to match our state type
    setData(newData as unknown as TravelRequest[]);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Encabezado con botón de acción y refresco */}
      <div className="flex items-center justify-between mb-6">
        <Button
          label="Viajes"
          className="bg-[#0a2c6d] text-white px-5 py-2 rounded-md"
        />
        <FaSyncAlt className="text-[#0a2c6d] text-2xl cursor-pointer" />
      </div>

      {/* Tabla editable con componentes personalizados */}
      <DynamicTable
        columns={columns}
        initialData={data as unknown as TableRow[]}
        onDataChange={handleDataChange}
      />

      {/* Información adicional del empleado */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm text-[#0a2c6d] font-medium">
        <div className="bg-gray-100 p-2 rounded">Empleado: 000001</div>
        <div className="bg-gray-100 p-2 rounded">Nombre: Juan Pérez</div>
        <div className="bg-gray-100 p-2 rounded">Acreedor: 000001</div>
        <div className="bg-gray-100 p-2 rounded">Posición: 000001</div>
        <div className="bg-gray-100 p-2 rounded">Correo: juan@mail.com</div>
        <div className="bg-gray-100 p-2 rounded">Sociedad: 000001</div>
      </div>
    </div>
  );
};

export default RequestRow;
