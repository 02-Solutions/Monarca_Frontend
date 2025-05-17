import { Link } from "react-router-dom";
import React, { ReactNode, useState, useEffect } from "react";

interface Column {
  key: string;
  header: string;
}

interface TableProps {
  columns: Array<Column>;
  data: Array<{
    id: number; // Asegúrate que tus datos tengan id para manejar la expansión
    [key: string]: string | number | boolean | null | undefined | ReactNode;
  }>;
  itemsPerPage?: number;
}

const Table: React.FC<TableProps> = ({ columns, data, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [localData, setLocalData] = useState(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const totalPages = Math.ceil(localData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = localData.slice(indexOfFirstItem, indexOfLastItem);

  const changePage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const toggleExpand = (rowId: number) => {
    setExpandedRowId((curr) => (curr === rowId ? null : rowId));
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs text-white uppercase bg-[#0a2c6d]">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-2 text-center ${
                    index === 0 ? "rounded-l-lg" : ""
                  } ${
                    // quitamos rounded-r-lg para columnas antes de las dos últimas
                    index === columns.length - 1 ? "" : ""
                  }`}
                >
                  {column.header}
                </th>
              ))}

              {/* Header Acción: sin borde redondeado, con borde derecho sólido */}
              <th className="px-4 py-2 text-center border-r border-[#0a2c6d]">
                Detalles
              </th>

              {/* Header Detalles: borde izquierdo sólido y borde derecho redondeado */}
              <th className="px-4 py-2 text-center rounded-r-lg">Datos</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="bg-[#4C6997] text-white text-center">
                  {columns.map((column, cidx) => (
                    <td
                      key={cidx}
                      className={`px-4 py-3 ${
                        cidx === 0 ? "rounded-l-lg" : ""
                      } ${
                        // quitar rounded-r-lg en penúltima columna
                        cidx === columns.length - 1 ? "" : ""
                      }`}
                    >
                      {row[column.key] !== undefined && row[column.key] !== null
                        ? row[column.key]
                        : "N/A"}
                    </td>
                  ))}

                  <td className="text-sm">
                    <Link to="/application-info" className="bg-[var(--white)] text-[var(--blue)] p-1 rounded-sm">Ver Solicitud</Link>
                  </td>

                  {/* Celda Detalles: borde izquierdo sólido, borde derecho redondeado */}
                  <td className="px-4 py-3 rounded-r-lg">
                    <button
                      onClick={() => toggleExpand(row.id)}
                      className="text-xl hover:text-gray-700"
                      aria-label="Expandir detalles"
                    >
                      {expandedRowId === row.id ? "▲" : "▼"}
                    </button>
                  </td>
                </tr>

                {expandedRowId === row.id && (
                  <tr>
                    <td
                      colSpan={columns.length + 2}
                      className="bg-white text-black p-4 rounded-b-lg"
                    >
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <strong>Empleado:</strong> {row.employee}
                        </div>
                        <div>
                          <strong>Nombre:</strong> {row.name}
                        </div>
                        <div>
                          <strong>Acreedor:</strong> {row.creditor}
                        </div>

                        <div>
                          <strong>Posición:</strong> {row.position}
                        </div>
                        <div>
                          <strong>Correo electrónico:</strong> {row.email}
                        </div>
                        <div>
                          <strong>Sociedad:</strong> {row.company}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-[#0a2c6d] text-white disabled:opacity-50"
            aria-label="Página anterior"
          >
            &lt;
          </button>

          <span className="text-[#0a2c6d] font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-[#0a2c6d] text-white disabled:opacity-50"
            aria-label="Página siguiente"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
