/**
 * Generic table component that renders data in a customizable table format.
 * Supports various data types including strings, numbers, booleans, and React nodes.
 * 
 * Last edit: April 16, 2025
 * Authors: José Manuel García Zumaya
 */
import React, { ReactNode } from 'react';

/**
 * Column interface to define the structure of each column in the table.
 * key: The key in the data object that corresponds to this column, this is very 
 * important due allows to access the data dynamically in our object data.
 * header: The header text to display for this column.
 */
interface Column {
  key: string;
  header: string;
}

/**
 * TableProps interface to define the structure of the props for the Table component.
 * columns: An array of Column objects defining the table's columns.
 * data: An array of objects representing the rows of the table, each object MUST
 * contain keys that match the column keys.
 */
interface TableProps {
  columns: Array<Column>;
  data: Array<{ [key: string]: string | number | boolean | null | undefined | ReactNode }>;
}

/**
 * IMPORTANT: Note the key property in the Column and TableProps interfaces, since the way that
 * this works is that the key in the Column interface is used to access the data in the data array, 
 * so with this form we can access the data dynamically in our object data and show it in the table.
 */

/**
 * Table component that renders a table based on the provided columns and data.
 * We use the default styles defined in Figma design system
 */
const Table: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-y-2">
        <thead>
          <tr className="text-xs text-white uppercase bg-[#0a2c6d] border-b-8 border-violet-200">
            {/* Contruct the headers of the table, based on colum property */}
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`px-4 py-2 text-center ${
                  index === 0 ? 'rounded-tl-lg rounded-bl-lg' : ''
                } ${
                  index === columns.length - 1 ? 'rounded-tr-lg rounded-br-lg' : ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
            {/* Contruct the rows of the table, based on data property */}
            {/* We use the map function to iterate over each row in the data array */}
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`bg-[#4C6997] text-white text-center`}
            >
            {/* And then we use another map function to iterate over each column */}
            {/* in the columns array to create the cells data of the table */}
              {columns.map((column, cellIndex) => (
                <td 
                  key={cellIndex} 
                  className={`px-4 py-3 ${
                    cellIndex === 0 ? 'rounded-l-lg' : ''
                  } ${
                    cellIndex === columns.length - 1 ? 'rounded-r-lg' : ''
                  }`}
                >
                    {/* Check if the data for this cell is defined, if not show N/A */}
                  {row[column.key] !== undefined && row[column.key] !== null
                    ? (
                       /* Render the data, that might be number, string, boolean or ReactNode.
                        * Note here access the data through the key property of the column object
                        * to get the value from the row object. This is important because we are
                        * using the key property to access the data dynamically in our object data. 
                       */
                        row[column.key]
                      )
                    : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;