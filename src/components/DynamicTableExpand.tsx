/*
 * DynamicTableExpand component that renders a table with dynamic rows and columns.
 *
 * Last edit: April 24, 2025
 * Authors: José Manuel García Zumaya
 * Le agregue para que se pueda desplegar la tabla (josefina)
 */
import React, { useState } from "react";

/*
 * Column interface SCHEMA to define the structure of each column in the table.
 * key: The key in the data object that corresponds to this column, this is very
 * important due allows to access the data dynamically in our object data.
 * header: The header text to display for this column.
 * defaultValue: The default value to display in the cell or inside the component
 * that you want to use to render the cell, if not provided, it will be empty.
 * renderCell: (VERY IMPORTANT) A function that helps to render custom components
 * inside the cell, this function receives a value to show in the component and a
 * function to handle the change of that component, this function is used to update
 * the component from child to parent, this function is optional, if not provided,
 * the default value will be used, for example if you want to show a static value
 * or a simple text, you can see that returns an object of type ReactNode, so it
 * should be used to render components like InputField, Dropdown, etc.
 *
 * You can reach an example of how to use this in the src/pages/Refunds/Refunds.tsx file.
 */
interface Column {
  key: string;
  header: string;
  defaultValue?: string | number | boolean | null | undefined | React.ReactNode;
  renderCell?: (
    value: string | number | boolean | null | undefined | React.ReactNode,
    handleFieldChange: Function,
    rowIndex?: number
  ) => React.ReactNode;
}

/*
 * DynamicTableExpandProps interface to define the structure of the props for the DynamicTableExpand component.
 * columns: An array of Column objects defining the table's columns.
 * initialData: An optional initial data array to populate the table.
 * onDataChange: A callback function that is called when the data changes,
 * it helps to notify the parent component of the change and need to render the table again.
 * expandedRows: (NUEVO) Índices de filas expandidas.
 * renderExpandedRow: (NUEVO) Función que renderiza el contenido expandido debajo de la fila.
 */
interface DynamicTableExpandProps {
  columns: Column[];
  initialData?: [];
  onDataChange?: (data: []) => void;
  expandedRows?: number[];
  renderExpandedRow?: (index: number) => React.ReactNode;
}

/*
 * DynamicTableExpand component that renders a table with dynamic rows and columns.
 * It allows adding new rows and updating existing ones.
 */
const DynamicTableExpand: React.FC<DynamicTableExpandProps> = ({
  columns,
  initialData = [],
  onDataChange,
  expandedRows = [],
  renderExpandedRow,
}) => {
  const [tableData, setTableData] = useState(initialData);

  const handleFieldChange = (rowIndex, columnKey, newValue) => {
    const updatedData = [...tableData];

    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      [columnKey]: newValue,
    };

    setTableData(updatedData);

    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  const addItem = () => {
    const defaultRow = columns.reduce((obj, column) => {
      obj[column.key] = column.defaultValue || "";
      return obj;
    }, {});

    const updatedData = [...tableData, defaultRow];
    setTableData(updatedData);

    if (onDataChange) {
      onDataChange(updatedData);
    }
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
                  } ${index === columns.length - 1 ? "rounded-r-lg" : ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr className="bg-[#4C6997] text-white text-center">
                  {columns.map((column, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-4 py-3 ${
                        cellIndex === 0 ? "rounded-l-lg" : ""
                      } ${
                        cellIndex === columns.length - 1 ? "rounded-r-lg" : ""
                      }`}
                    >
                      {column.renderCell
                        ? column.renderCell(
                            row[column.key],
                            (newValue) =>
                              handleFieldChange(rowIndex, column.key, newValue),
                            rowIndex
                          )
                        : row[column.key]}
                    </td>
                  ))}
                </tr>

                {/* Expanded row (optional) */}
                {expandedRows.includes(rowIndex) && renderExpandedRow && (
                  <tr className="bg-[#f4f6f8] text-black">
                    <td colSpan={columns.length} className="px-6 py-4">
                      {renderExpandedRow(rowIndex)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={addItem}
          className="px-4 py-2 bg-[#0a2c6d] text-white rounded-md hover:bg-[#0d3d94] transition-colors hover:cursor-pointer"
        >
          + Añadir comprobante de gasto
        </button>
      </div>
    </div>
  );
};

export default DynamicTableExpand;
