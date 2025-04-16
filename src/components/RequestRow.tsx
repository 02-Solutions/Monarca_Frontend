/**
 * @file ProductTable.tsx
 * @description Componente de tabla para mostrar solicitudes de viaje con opción de edición.
 * @lastEdited 2025-04-10
 * @author Isaac
 */

import React, { useState } from "react";

// Interface que define la estructura de cada fila de la tabla
interface RowData {
  id: string;
  date: string;
  city: string;
  country: string;
  reason: string;
  status: string;
  settlement: string;
  refund: string;
  currency: string;
}

// Datos de ejemplo iniciales
const INITIAL_DATA: RowData[] = [
  {
    id: "0001",
    date: "14/09/2020",
    city: "Cancún",
    country: "MX",
    reason: "Viaje",
    status: "Autorizado",
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
    status: "Autorizado",
    settlement: "Comprobado",
    refund: "$200",
    currency: "MXN",
  },
];

/**
 * Componente que muestra una tabla editable con datos de solicitudes de viaje.
 * Permite editar fila por fila mostrando inputs al hacer clic en "Editar".
 */
const ProductTable: React.FC = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<RowData | null>(null);

  // Inicia la edición de una fila
  const startEdit = (row: RowData) => {
    setEditingRow(row.id);
    setEditedValues({ ...row });
  };

  // Maneja cambios en los inputs durante la edición
  const handleChange = (field: keyof RowData, value: string) => {
    if (!editedValues) return;
    setEditedValues({ ...editedValues, [field]: value });
  };

  // Guarda la fila editada
  const saveEdit = () => {
    if (!editedValues) return;
    const updatedData = data.map((row) =>
      row.id === editedValues.id ? editedValues : row
    );
    setData(updatedData);
    setEditingRow(null);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-white uppercase bg-[#0a2c6d]">
          <tr>
            <th className="px-4 py-2"></th>
            <th className="px-4 py-2">Viaje</th>
            <th className="px-4 py-2">Fecha Salida</th>
            <th className="px-4 py-2">Población</th>
            <th className="px-4 py-2">País</th>
            <th className="px-4 py-2">Razón</th>
            <th className="px-4 py-2">Autorización</th>
            <th className="px-4 py-2">Comprobación</th>
            <th className="px-4 py-2">Reembolso</th>
            <th className="px-4 py-2">Moneda</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <React.Fragment key={row.id}>
              <tr className="bg-[#4C6997] text-white">
                <td className="px-4 py-2 text-lg">●</td>
                <td className="px-4 py-2">{row.id}</td>
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.city}</td>
                <td className="px-4 py-2">{row.country}</td>
                <td className="px-4 py-2">{row.reason}</td>
                <td className="px-4 py-2">{row.status}</td>
                <td className="px-4 py-2">{row.settlement}</td>
                <td className="px-4 py-2">{row.refund}</td>
                <td className="px-4 py-2">{row.currency}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => startEdit(row)}
                    className="bg-white text-gray-800 px-3 py-1 rounded shadow hover:bg-gray-100 text-sm"
                  >
                    Editar 
                  </button>
                </td>
              </tr>

              {editingRow === row.id && editedValues && (
                <tr className="bg-gray-100 border-t">
                  <td />
                  {Object.entries(editedValues).map(([key, value]) => (
                    <td key={key} className="px-4 py-2">
                      <input
                        className="w-full px-2 py-1 rounded"
                        value={value}
                        onChange={(e) =>
                          handleChange(key as keyof RowData, e.target.value)
                        }
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <button
                      onClick={saveEdit}
                      className="bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 text-sm"
                    >
                      Guardar
                    </button>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
