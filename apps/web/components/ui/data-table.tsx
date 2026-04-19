'use client';

import React, { useState } from 'react';
import { GlassCard } from './glass-card';

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor?: (row: T, index: number) => string | number;
}

export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(
  (
    {
      columns,
      data,
      onRowClick,
      loading = false,
      emptyMessage = 'No data available',
      keyExtractor = (_, i) => i,
    },
    ref
  ) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: 'asc' | 'desc';
    } | null>(null);

    const sortedData = React.useMemo(() => {
      if (!sortConfig) return data;

      const sorted = [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });

      return sorted;
    }, [data, sortConfig]);

    const handleSort = (key: string) => {
      setSortConfig((prev) => {
        if (prev?.key === key) {
          return {
            key,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
          };
        }
        return { key, direction: 'asc' };
      });
    };

    return (
      <GlassCard ref={ref} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.07)]">
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    className={`
                      px-6 py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-widest
                      text-[rgba(255,255,255,0.6)]
                      ${col.width || ''}
                      ${col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''}
                    `.trim()}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && sortConfig?.key === String(col.key) && (
                        <span className="text-[#7B6EF6]">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                // Skeleton Loader Rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-[rgba(255,255,255,0.04)]">
                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-6 py-4">
                        <div className="h-4 bg-[rgba(255,255,255,0.05)] rounded animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sortedData.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12">
                    <div className="text-center">
                      <p className="text-[rgba(255,255,255,0.5)] text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                sortedData.map((row, idx) => (
                  <tr
                    key={keyExtractor(row, idx)}
                    onClick={() => onRowClick?.(row)}
                    className={`
                      border-b border-[rgba(255,255,255,0.04)]
                      transition-all duration-200
                      ${onRowClick ? 'hover:bg-[rgba(255,255,255,0.04)] cursor-pointer' : ''}
                    `.trim()}
                  >
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={`px-6 py-4 text-sm ${col.width || ''}`}
                      >
                        <span className="text-white">
                          {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    );
  }
);

DataTable.displayName = 'DataTable';
