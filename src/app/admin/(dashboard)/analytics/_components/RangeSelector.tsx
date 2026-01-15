'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RangeSelector({ currentDays }: { currentDays: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const options = [
        { label: 'I dag', value: 1 },
        { label: 'Siste 7 dager', value: 7 },
        { label: 'Siste 30 dager', value: 30 },
        { label: 'Siste 90 dager', value: 90 },
        { label: 'Siste 180 dager', value: 180 },
        { label: 'All tid', value: 0 },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const days = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set('days', days);
        router.push(`?${params.toString()}`);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
                value={currentDays}
                onChange={handleChange}
                style={{
                    appearance: 'none',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 2.5rem 0.75rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'org.w3.org/2000/svg\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.25rem'
                }}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
