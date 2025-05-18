/*
 * Table component that renders data in a customizable table format with pagination.
 *
 * Last edit: April 20, 2025
 * Authors: José Manuel García Zumaya
 */
import React, { ReactNode, useState } from "react";

/*
 * Column interface SCHEMA to define the structure of each column in the table.
 * key: The key in the data object that corresponds to this column, this is very
 * important due allows to access the data dynamically in our object data.
 * header: The header text to display for this column.
 */
interface Column {
  key: string;
  header: string;
}

/*
 * TableProps interface to define the structure of the props for the Table component.
 * columns: An array of Column objects defining the table's columns.
 * data: An array of objects representing the rows of the table, each object MUST
 * contain keys that match the column keys.
 * itemsPerPage: Number of items to display per page (default: 5).
 *
 * You can reach an example of how to use this in the src/pages/Refunds/Refunds.tsx file.
 */
interface TableProps {
  columns: Array<Column>;
  data: Array<{
    [key: string]: string | number | boolean | null | undefined | ReactNode;
  }>;
  itemsPerPage?: number;
}

/*
 * IMPORTANT: Note the key property in the Column and TableProps interfaces, since the way that
 * this works is that the key in the Column interface is used to access the data in the data array,
 * so with this form we can access the data dynamically in our object data and show it in the table.
 */

/*
 * Table component that renders a table based on the provided columns and data with pagination controls.
 */
const Table: React.FC<TableProps> = ({ columns, data, itemsPerPage = 5, }) => {
  /*
   * State to manage the current page of the table.
   */
  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Calculate the total number of pages based on the data length and items per page.
   * Ex. If there are 10 items and itemsPerPage is 3, the division will be 3.33,
   * which is rounded up to 4 pages, the distriution will be: 3, 3, 3, 1.
   */
  const totalPages = Math.ceil(data.length / itemsPerPage);

  /*
   * Calculate the indeces to display the current items based on the current page.
   */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  /*
   * Slice the data array to get the items for the current page.
   * Remeber that the slice method does not modify the original array,
   * and the first parameter is inclusive and the second is exclusive.
   */
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  /*
   * Function to update the current page using the UseState hook.
   * We ensure that the page number is within the valid range to avoid
   * out of bounds errors.
   */
  const changePage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="relative">
      {/* Table component */}
      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs text-white uppercase bg-[#0a2c6d]">
              {/*
               * Contruct the headers of the table, based on colum property
               * Use the index to rounded the borders of the cell.
               */}
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
            {/*
             * Contruct the rows of the table, based on currentItems array,
             * currentItems is the sliced data array based on the current page
             * and itemsPerPage.
             *
             * THE LOGIC IS for each row of data in the currentItems array,
             * we create a new row in the table, and then for each colum (headers)
             * in the colums array, we create a new cell in the current row, finally
             * access the data by colum.key in the row data, to display in the correct place.
             */}
            {currentItems.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="bg-[#4C6997] text-white text-center"
              >
                {/*
                 * And then we use another map function to iterate over each column
                 * in the columns array to create the cells data of the table.
                 * Use the cellIndex to rounded the borders of the cell.
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
                    {/*
                     * Access to data by colum.key in the row data, to display in the correct place
                     * Check if the data for this cell is defined, if not show N/A.
                     */}
                    {row[column.key] !== undefined && row[column.key] !== null
                      ? /*
                         * Render the data, that might be number, string, boolean or ReactNode.
                         * Note here access the data through the key property of the column object
                         * to get the value from the row object. This is important because we are
                         * using the key property to access the data dynamically in our object data.
                         */
                        row[column.key]
                      : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*
       * Pagination controls
       * The buttons call the changePage function of useState hook to update the current page.
       */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          {/* Disable the button if we are in the first or final page */}
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-[#0a2c6d] text-white disabled:opacity-50 hover:cursor-pointer"
            aria-label="Previous page"
          >
            &lt;
          </button>

          <span className="text-[#0a2c6d] font-medium">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-[#0a2c6d] text-white disabled:opacity-50 hover:cursor-pointer"
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
