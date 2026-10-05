import React from 'react';

// This is a generic DataTable component.
// It takes columns definition and data to render a table.
// Actions like edit/delete can be passed via the columns definition.

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

const DataTable = <T extends { id: number }>({ columns, data, onEdit, onDelete }: DataTableProps<T>) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((col, index) => (
                  <td key={index} className="px-6 py-4 max-w-xs break-words text-sm leading-5">
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    {onEdit && (
                      <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;