'use client'

import { useState } from 'react'
import OpeningHoursEditor from './OpeningHoursEditor'
import { Search } from 'lucide-react'

// Define the interface to match what's passed from page.tsx (Prisma result)
interface OpeningHour {
    id: string
    saunaId: string
    weekday: number
    opens: string | null
    closes: string | null
    active: boolean
}

interface Sauna {
    id: string
    name: string
    openingHours: OpeningHour[]
}

export default function OpeningHoursList({ saunas }: { saunas: Sauna[] }) {
    const [search, setSearch] = useState('')

    const filteredSaunas = saunas.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div>
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                <input
                    type="text"
                    placeholder="Søk etter lokasjon..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {filteredSaunas.map(sauna => (
                <OpeningHoursEditor key={sauna.id} sauna={sauna} />
            ))}

            {filteredSaunas.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Ingen lokasjoner funnet.
                </div>
            )}
        </div>
    )
}
