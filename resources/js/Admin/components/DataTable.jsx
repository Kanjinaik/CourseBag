import { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';

export default function DataTable({
    columns = [],
    data = [],
    emptyMessage = 'No data found',
    emptyDescription = 'Data will appear here once available',
    searchable = true,
    searchPlaceholder = 'Search...',
    onRowClick = null,
    className = '',
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter((row) => {
            return columns.some((column) => {
                const value = column.accessor ? getNestedValue(row, column.accessor) : row[column.key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, columns]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const column = columns.find((col) => col.key === sortConfig.key);
            if (!column) return 0;

            const aValue = column.accessor ? getNestedValue(a, column.accessor) : a[sortConfig.key];
            const bValue = column.accessor ? getNestedValue(b, column.accessor) : b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (column.sortType === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (sortConfig.direction === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }, [filteredData, sortConfig, columns]);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    };

    const renderCell = (row, column, index) => {
        if (column.render) {
            return column.render(row, column, index);
        }

        const value = column.accessor ? getNestedValue(row, column.accessor) : row[column.key];

        if (value === null || value === undefined) {
            return <span className="text-gray-400">—</span>;
        }

        if (column.type === 'date') {
            return new Date(value).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }

        if (column.type === 'datetime') {
            return new Date(value).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        if (column.type === 'currency') {
            return `₹${parseFloat(value).toFixed(2)}`;
        }

        if (column.type === 'badge') {
            const badgeClass = column.badgeClass
                ? column.badgeClass(value, row)
                : 'bg-gray-100 text-gray-700';
            return (
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
                    {value}
                </span>
            );
        }

        return String(value);
    };

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
            {/* Search Bar */}
            {searchable && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`text-left py-4 px-6 text-sm font-semibold text-gray-700 ${
                                        column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                                    }`}
                                    onClick={() => column.sortable !== false && handleSort(column.key)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{column.label}</span>
                                        {column.sortable !== false && sortConfig.key === column.key && (
                                            <svg
                                                className={`w-4 h-4 ${sortConfig.direction === 'asc' ? '' : 'transform rotate-180'}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 15l7-7 7 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedData && sortedData.length > 0 ? (
                            sortedData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        onRowClick ? 'cursor-pointer' : ''
                                    }`}
                                    onClick={() => onRowClick && onRowClick(row)}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="py-4 px-6 text-sm text-gray-800">
                                            {renderCell(row, column, index)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="py-12 px-6 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg
                                            className="w-12 h-12 text-gray-400 mb-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            />
                                        </svg>
                                        <p className="text-sm font-medium">{emptyMessage}</p>
                                        <p className="text-xs mt-1">{emptyDescription}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results Count */}
            {searchable && searchTerm && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-600">
                        Showing {sortedData.length} of {data.length} results
                    </p>
                </div>
            )}
        </div>
    );
}

