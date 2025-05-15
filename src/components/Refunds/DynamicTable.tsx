import React, { useState } from "react";

/*
 * Column interface SCHEMA to define the structure of each column in the table.
 * key: The key in the data object that corresponds to this column.
 * header: The header text to display for this column.
 * defaultValue: The default value to display in the cell or inside the component.
 * renderCell: A function that helps to render custom components inside the cell.
 */

interface Column {
  key: string;
  header: string;
  defaultValue?: string | number | boolean | null | undefined;
  renderCell?: (
    value: string | number | boolean | null | undefined, // Changed from ReactNode
    handleFieldChange: (newValue: string | number | boolean | null | undefined) => void,
    rowIndex?: number
  ) => React.ReactNode;
}
/*
 * DynamicTableProps interface to define the structure of the props for the DynamicTable component.
 */
/* Interface for table row data structure */
// interface TableRow {
//   [key: string]: string | number | boolean | null | undefined | ReactNode;
// }

interface DynamicTableProps {
  columns: Column[];
  initialData?: any[]; // Add proper typing here if known
  onDataChange?: (data: any[]) => void;
  expandedRows?: number[];
  renderExpandedRow?: (index: number) => React.ReactNode;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  initialData = [],
  onDataChange,
  expandedRows = [],
  renderExpandedRow,
}) => {
  const [tableData, setTableData] = useState<any[]>(initialData); // Replace any[] with the proper type if possible

  const handleFieldChange = (rowIndex: number, columnKey: string, newValue: any) => {
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
    }, {} as Record<string, any>); // Ensure proper typing of the default row

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
                            (newValue: string | number | boolean | null | undefined) =>
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

export default DynamicTable;
