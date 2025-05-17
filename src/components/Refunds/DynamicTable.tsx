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
 * columns: An array of Column objects defining the table's columns.
 * initialData: An optional initial data array to populate the table.
 * onDataChange: A callback function that is called when the data changes,
 * it helps to notify the parent component of the change and need to render the table again.
 */
/* Interface for table row data structure */
export interface TableRow {
  [key: string]: CellValueType;
}

export interface DynamicTableProps {
  columns: Column[];
  initialData?: TableRow[];
  onDataChange?: (data: TableRow[]) => void;
}

/*
 * DynamicTable component that renders a table with dynamic rows and columns.
 * It allows adding new rows and updating existing ones.
 */
const DynamicTable: React.FC<DynamicTableProps> = ({
  columns,
  initialData = [],
  onDataChange,
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

    /* Update the local state data with the new data */
    setTableData(updatedData);

    /* Notify the parent component of the change
     * This is useful if you want to update the data in the parent component
     */
    if (onDataChange) {
      onDataChange(updatedData);
    }
  };

  /*
   * Function to add a new row to the table.
   * It creates a new row object with default values for each column or component
   * and adds it to the tableData array which renders the table.
   */
  const addItem = () => {
    /* Create a new row object using reduce to iterate over the columns */
    const defaultRow = columns.reduce((obj: TableRow, column) => {
      /* Remember that in TS we can create or access properties by using
       * the bracket notation, this is useful to create dynamic properties
       * in an object, so although the initial object is empty, we can
       * create properties dynamically using the column.key as the property name
       * and the defaultValue as the value to assign to that property.
       */
      obj[column.key] = column.defaultValue || "";
      return obj;
    }, {} as TableRow);

    /* Add the new row to the tableData state */
    const updatedData = [...tableData,defaultRow];
    setTableData(updatedData);

    /* Notify the parent component of the change */
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
        {/* Table component */}
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-y-2">
          <thead>
            {/*
             * Contruct the headers of the table, based on colum property
             * Use the index to rounded the borders of the cell.
             */}
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
            {
              /*
               * Contruct the rows of the table, based on tableData array,
               * tableData is the data array based on the current page
               *
               * THE LOGIC IS for each row of data in the tableItems array,
               * we create a new row in the table, and then for each colum (headers)
               * in the colums array, we create a new cell in the current row, finally
               * access the data by colum.key in the row data, to display in the correct place.
               */
              tableData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-[#4C6997] text-white text-center"
                >
                  {/*
                   * Use the index to rounded the borders of the cell.
                   */}
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
              ))
            }
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
