// src/pages/Bookings.tsx

import React, { useState } from "react";
import DynamicTable from "../components/Refunds/DynamicTable";
import InputField from "../components/Refunds/InputField";
import Dropdown from "../components/Refunds/DropDown";

const Bookings = () => {
  const [formData, setFormData] = useState([]);

  const columns = [
    {
      key: "estado",
      header: "Estado",
      defaultValue: "●", // o usa un ícono luego
    },
    {
      key: "viaje",
      header: "Viaje",
      defaultValue: "0001",
      renderCell: (value, onChange) => (
        <InputField
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      key: "fechaSalida",
      header: "Fecha Salida",
      defaultValue: "14/09/2020",
      renderCell: (value, onChange) => (
        <InputField
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      key: "poblacion",
      header: "Población",
      defaultValue: "Cancún",
      renderCell: (value, onChange) => (
        <InputField
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      key: "pais",
      header: "País",
      defaultValue: "MX",
      renderCell: (value, onChange) => (
        <InputField
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      key: "razon",
      header: "Razón",
      defaultValue: "Viaje",
      renderCell: (value, onChange) => (
        <InputField
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      key: "autorizacion",
      header: "Autorización",
      defaultValue: "Autorizado",
      renderCell: (value, onChange) => (
        <Dropdown
          value={value}
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
      defaultValue: "A liquidar",
    },
    {
      key: "reembolso",
      header: "Reembolso",
      defaultValue: "$100",
    },
    {
      key: "moneda",
      header: "Moneda",
      defaultValue: "MXN",
    },
    {
      key: "accion",
      header: "",
      renderCell: () => (
        <Dropdown
          value=""
          onChange={() => {}}
          options={[
            { value: "reservar", label: "Reservar" },
            { value: "cancelar", label: "Cancelar" },
          ]}
        />
      ),
    },
  ];

  const handleFormDataChange = (newData) => {
    setFormData(newData);
    console.log("Form updated:", newData);
  };

  return (
    <div className="max-w-full p-6 bg-[#eaeced] rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-[#0a2c6d] mb-1">
        Viajes por reservar
      </h2>

      <DynamicTable
        columns={columns}
        initialData={formData}
        onDataChange={handleFormDataChange}
      />
    </div>
  );
};

export default Bookings;
