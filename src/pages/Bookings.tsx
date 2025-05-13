import React, { useState } from "react";
import Layout from "../components/Layout";
import DynamicTable from "../components/Refunds/DynamicTable";
import InputField from "../components/Refunds/InputField";
import Dropdown from "../components/Refunds/DropDown";

// Type for form data rows
interface FormData {
  [key: string]: string | number | boolean | null | undefined;
}

const Bookings = () => {
  const [formData, setFormData] = useState<FormData[]>([
    { estado: "", viaje: "", fechaSalida: "", poblacion: "", pais: "", razon: "", autorizacion: "" },
    { estado: "", viaje: "", fechaSalida: "", poblacion: "", pais: "", razon: "", autorizacion: "" },
    { estado: "", viaje: "", fechaSalida: "", poblacion: "", pais: "", razon: "", autorizacion: "" },
  ]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const columns = [
    {
      key: "estado",
      header: "Estado",
      renderCell: (
        _value: string | number | boolean | null | undefined,
        _onChange: (newValue: string | number | boolean | null | undefined) => void,
        rowIndex?: number
      ) => (
        <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-900 mx-auto" />
      ),
    },
    {
      key: "viaje",
      header: "Viaje",
      defaultValue: "0001",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChange: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField 
          value={value as string} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ),
    },
    {
      key: "fechaSalida",
      header: "Fecha Salida",
      defaultValue: "2024-09-14",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChange: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField 
          type="date" 
          value={value as string} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ),
    },
    {
      key: "poblacion",
      header: "Población",
      defaultValue: "Cancún",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChange: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField 
          value={value as string} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ),
    },
    {
      key: "pais",
      header: "País",
      defaultValue: "MX",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChange: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField 
          value={value as string} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ),
    },
    {
      key: "razon",
      header: "Razón",
      defaultValue: "Viaje",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChange: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <InputField 
          value={value as string} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ),
    },
    {
      key: "autorizacion",
      header: "Autorización",
      defaultValue: "Autorizado",
      renderCell: (
        value: string | number | boolean | null | undefined,
        onChange: (newValue: string | number | boolean | null | undefined) => void
      ) => (
        <Dropdown
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          options={[
            { value: "Autorizado", label: "Autorizado" },
            { value: "Pendiente", label: "Pendiente" },
          ]}
        />
      ),
    },
    { 
      key: "comprobacion", 
      header: "Comprobación", 
      defaultValue: "A liquidar" 
    },
    { 
      key: "reembolso", 
      header: "Reembolso", 
      defaultValue: "$100" 
    },
    { 
      key: "moneda", 
      header: "Moneda", 
      defaultValue: "MXN" 
    },
    {
      key: "accion",
      header: "",
      renderCell: (
        _value: string | number | boolean | null | undefined,
        _onChange: (newValue: string | number | boolean | null | undefined) => void,
        rowIndex?: number
      ) => (
        <div className="flex gap-2 justify-end pr-2">
          <Dropdown
            value=""
            onChange={() => {}}
            options={[
              { value: "reservar", label: "Reservar" },
              { value: "cancelar", label: "Cancelar" },
            ]}
            className="rounded-md px-3 py-1 bg-[#001d3d] text-white text-sm"
          />
          <button
            onClick={() =>
              setExpandedRows((prev) =>
                prev.includes(rowIndex ?? -1)
                  ? prev.filter((i) => i !== rowIndex)
                  : [...prev, rowIndex ?? -1]
              )
            }
            className="text-white bg-[#001d3d] px-3 py-1 rounded-md hover:bg-[#003366] text-sm"
          >
            ▼
          </button>
        </div>
      ),
    },
  ];

  const handleFormDataChange = (newData: FormData[]) => {
    setFormData(newData);
  };

  return (
    <Layout title="Viajes por reservar">
      <div className="bg-[#F4F6F8] p-6 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <button className="bg-[#0a2c6d] hover:bg-[#003366] text-white font-semibold px-6 py-2 rounded shadow">
            Viajes
          </button>
          <button
            onClick={() => window.location.reload()}
            className="text-[#0a2c6d] hover:text-[#003366] text-xl"
            title="Refrescar"
          >
            🔄
          </button>
        </div>

        <DynamicTable
  columns={columns}
  initialData={formData}
  onDataChange={handleFormDataChange}
  expandedRows={expandedRows}
  renderExpandedRow={(rowIndex: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <InputField 
        value="000001" 
        label="Empleado" 
        onChange={() => {}} 
      />
      <InputField 
        value="Juan Perez" 
        label="Nombre" 
        onChange={() => {}} 
      />
      <InputField 
        value="000001" 
        label="Acreedor" 
        onChange={() => {}} 
      />
      <InputField 
        value="000001" 
        label="Posición" 
        onChange={() => {}} 
      />
      <InputField 
        value="juan@mail.com" 
        label="Correo electrónico" 
        onChange={() => {}} 
      />
      <InputField 
        value="000001" 
        label="Sociedad" 
        onChange={() => {}} 
      />
    </div>
  )}
/>
        {/* Paginador visual */}
        <div className="flex items-center justify-end mt-6 gap-2">
          <span className="text-sm mr-2">Enseñando Página</span>
          <span className="text-sm">1/3</span>

          <button className="bg-[#001d3d] text-white rounded-full px-4 py-1 text-sm hover:bg-[#003366]">
            Previa
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`rounded-full px-3 py-1 text-white text-sm ${
                page === 1 ? "bg-[#001d3d]" : "bg-[#7892b0]"
              }`}
            >
              {page}
            </button>
          ))}

          <button className="bg-[#001d3d] text-white rounded-full px-4 py-1 text-sm hover:bg-[#003366]">
            Siguiente
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;