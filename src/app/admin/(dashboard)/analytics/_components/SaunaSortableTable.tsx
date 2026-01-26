'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface SaunaStatRow {
    id: string;
    name: string;
    views: number;
    uniqueDropin: number;
    uniquePrivate: number;
    dropinClicks: number;
    privateClicks: number;
    conversion: string | number;
}

interface SaunaSortableTableProps {
    data: SaunaStatRow[];
}

type SortColumn = 'name' | 'views' | 'dropinClicks' | 'privateClicks' | 'conversion';
type SortDirection = 'asc' | 'desc';

const thStyle = {
    padding: '1rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    borderBottom: '2px solid #f1f5f9',
    transition: 'all 0.2s'
} as const;

const tdStyle = {
    padding: '1rem',
    fontSize: '0.9rem',
    color: '#334155'
} as const;

const SortIcon = ({ column, currentSortColumn, sortDirection }: { column: SortColumn, currentSortColumn: SortColumn, sortDirection: SortDirection }) => {
    if (currentSortColumn !== column) return null;
    return sortDirection === 'asc' ? (
        <ChevronUp size={14} style={{ display: 'inline', marginLeft: '0.25rem' }} />
    ) : (
        <ChevronDown size={14} style={{ display: 'inline', marginLeft: '0.25rem' }} />
    );
};

const SortHeader = ({
    column,
    label,
    title,
    currentSortColumn,
    sortDirection,
    onSort
}: {
    column: SortColumn;
    label: string;
    title?: string;
    currentSortColumn: SortColumn;
    sortDirection: SortDirection;
    onSort: (col: SortColumn) => void;
}) => (
    <th
        style={{
            ...thStyle,
            textAlign: column === 'name' ? 'left' : 'right',
            cursor: 'pointer',
            userSelect: 'none',
            backgroundColor: currentSortColumn === column ? '#f8fafc' : 'transparent',
            fontWeight: currentSortColumn === column ? '700' : '500'
        }}
        onClick={() => onSort(column)}
        title={title || "Klikk for å sortere"}
    >
        {label} <SortIcon column={column} currentSortColumn={currentSortColumn} sortDirection={sortDirection} />
    </th>
);

export function SaunaSortableTable({ data }: SaunaSortableTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>('views');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (sortColumn === 'conversion') {
            aVal = typeof aVal === 'string' ? parseFloat(aVal) : aVal;
            bVal = typeof bVal === 'string' ? parseFloat(bVal) : bVal;
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8fafc' }}>
                        <SortHeader column="name" label="Badstue" currentSortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                        <SortHeader column="views" label="Visninger" currentSortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                        <SortHeader column="dropinClicks" label="Drop-in bookinger" currentSortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                        <SortHeader column="privateClicks" label="Private bookinger" currentSortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                        <SortHeader column="conversion" label="Konvertering %" title="Andel av visninger som endte i booking (drop-in eller private)" currentSortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((s, idx) => (
                        <tr
                            key={s.id}
                            style={{
                                backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'background-color 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f9fafb')}
                        >
                            <td style={{ ...tdStyle, fontWeight: '600', color: '#1e293b' }}>
                                <Link
                                    href={`/admin/badstuer/${s.id}`}
                                    style={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#719898')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#1e293b')}
                                >
                                    {s.name}
                                </Link>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600' }}>
                                {s.views.toLocaleString()}
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', color: '#059669', fontWeight: '500' }}>
                                {s.uniqueDropin > 0 ? s.uniqueDropin : '—'}
                                {s.dropinClicks > s.uniqueDropin && (
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block' }}>
                                        ({s.dropinClicks} totalt)
                                    </span>
                                )}
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', color: '#7c3aed', fontWeight: '500' }}>
                                {s.uniquePrivate > 0 ? s.uniquePrivate : '—'}
                                {s.privateClicks > s.uniquePrivate && (
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block' }}>
                                        ({s.privateClicks} totalt)
                                    </span>
                                )}
                            </td>
                            <td
                                style={{
                                    ...tdStyle,
                                    textAlign: 'right',
                                    fontWeight: '700',
                                    color: (typeof s.conversion === 'string' ? parseFloat(s.conversion) : s.conversion) > 5 ? '#10b981' : (typeof s.conversion === 'string' ? parseFloat(s.conversion) : s.conversion) > 0 ? '#f59e0b' : '#cbd5e1'
                                }}
                                title="Andel av visninger som endte i booking (drop-in eller private)"
                            >
                                {s.conversion}%
                            </td>
                        </tr>
                    ))}
                    {sortedData.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', color: '#94a3b8' }}>
                                Ingen badstue-data tilgjengelig ennå.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
