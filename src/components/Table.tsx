import React from 'react';

interface TableProps {
    headers: Array<{ [key: string]: string | number | boolean | null | undefined | Button | Dropdown }>;
    data: Array<{ [key: string]: string | number | boolean | null | undefined }>;
}

const Table: React.FC<TableProps> = ({ headers, data }) => {
    return (
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} class="px-6 py-3">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            {headers.map((header, cellIndex) => (
                                <td key={cellIndex} class="px-6 py-4">
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default Table;