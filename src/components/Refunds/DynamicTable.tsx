/*
 * DynamicTable component that renders a table with dynamic rows and columns.

 * Last edit: April 29, 2025
 * Authors: José Manuel García Zumaya
 */
import React, { useState, ReactNode } from "react";

// Define a type for all possible cell values including File objects
export type CellValueType =
  | string
  | number
  | boolean
  | null
  | undefined
  | ReactNode
  | File;

/*
 * Column interface SCHEMA to define the structure of each column in the table.
 * key: The key in the data object that corresponds to this column.
 * header: The header text to display for this column.
 * defaultValue: The default value to display in the cell or inside the component.
 * renderCell: A function that helps to render custom components inside the cell.
 */
export interface Column {
  key: string;
  header: string;
  defaultValue?: CellValueType;
  renderCell?: (
    value: CellValueType,
    handleFieldChange: (newValue: CellValueType) => void,
    rowIndex?: number
  ) => React.ReactNode;
}
/*
 * DynamicTableProps interface to define the structure of the props for the DynamicTable component.
 */
/* Interface for table row data structure */
export interface TableRow {
  [key: string]: CellValueType;
}

export interface DynamicTableProps {
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
  /*
   * State to manage the table data.
   * The initial data is set to the initialData prop, or an empty array if not provided.
   * This is useful if there are data that is already loaded in the table.
   */
  const [tableData, setTableData] = useState<TableRow[]>(initialData);

  /*
   * Function to handle changes in the table data.
   * It receives the row index, column key, and new value.
   * Using TableRow interface defined above
   */
  const handleFieldChange = (
    rowIndex: number,
    columnKey: string,
    newValue: CellValueType
  ): void => {
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

    /* Add the new row to the tableData state */
    const updatedData = [...tableData,defaultRow];
    setTableData(updatedData);

    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  // Function to render cell content safely
  const renderCellContent = (value: CellValueType): React.ReactNode => {
    if (value instanceof File) {
      return value.name; // Show the filename instead of the File object
    }

    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object" && !React.isValidElement(value)) {
      return JSON.stringify(value);
    }

    return value;
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
                      {
                        /*
                         * Here render the cell data, if the column has a renderCell function (that means a component)
                         * we call it and pass the parameters to it, the value for the component to display it and an
                         * anonymous function to update the state of the data localy, please see the definition of the
                         * column interface to understand why an value and a function are passed to the renderCell function.
                         * If there is no renderCell function, we just display the value of the cell like a static text.
                         *
                         * This can be a tricky of understanding, so please reach me José Manuel García Zumaya if you have any question about this.
                         */
                        column.renderCell
                          ? column.renderCell(
                              row[column.key],
                              (newValue) =>
                                handleFieldChange(
                                  rowIndex,
                                  column.key,
                                  newValue
                                ),
                              rowIndex
                            )
                          : renderCellContent(row[column.key])
                      }
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
