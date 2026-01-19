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
        let aVal: any = a[sortColumn];
        let bVal: any = b[sortColumn];

        // Handle numeric conversion
        if (sortColumn === 'conversion') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ column }: { column: SortColumn }) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? (
            <ChevronUp size={14} style={{ display: 'inline', marginLeft: '0.25rem' }} />
        ) : (
            <ChevronDown size={14} style={{ display: 'inline', marginLeft: '0.25rem' }} />
        );
    };

    const SortHeader = ({ column, label }: { column: SortColumn; label: string }) => (
        <th
            style={{
                ...thStyle,
                textAlign: column === 'name' ? 'left' : 'right',
                cursor: 'pointer',
                userSelect: 'none',
                backgroundColor: sortColumn === column ? '#f8fafc' : 'transparent',
                fontWeight: sortColumn === column ? '700' : '500'
            }}
            onClick={() => handleSort(column)}
            title="Klikk for å sortere"
        >
            {label} <SortIcon column={column} />
        </th>
    );

    const tdStyle = {
        padding: '1rem 0',
        fontSize: '0.9rem',
        color: '#334155'
    };

    const thStyle = {
        padding: '1rem 0',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        borderBottom: '2px solid #f1f5f9',
        transition: 'all 0.2s'
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <SortHeader column="name" label="Badstue" />
                        <SortHeader column="views" label="Visninger" />
                        <SortHeader column="dropinClicks" label="Drop-in bookinger" />
                        <SortHeader column="privateClicks" label="Private bookinger" />
                        <SortHeader column="conversion" label="Konvertering" />
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((s) => (
                        <tr
                            key={s.id}
                            style={{
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'background-color 0.2s',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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
                                {s.uniqueDropin}
                                {s.dropinClicks > s.uniqueDropin && (
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block' }}>
                                        ({s.dropinClicks} totalt)
                                    </span>
                                )}
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right', color: '#7c3aed', fontWeight: '500' }}>
                                {s.uniquePrivate}
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
                                    color: parseFloat(s.conversion as string) > 5 ? '#10b981' : '#f59e0b'
                                }}
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
