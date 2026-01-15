import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

import { toggleSaunaStatus, deleteSauna } from './actions'


export default async function AdminSaunasPage() {
    const saunas = await prisma.sauna.findMany({
        orderBy: { sorting: 'asc' }
    })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Badstuer</h1>
                <Link href="/admin/badstuer/ny">
                    <Button>Ny Badstue</Button>
                </Link>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Navn</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Driftstatus</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>Handlinger</th>
                        </tr>
                    </thead>
                    <tbody>
                        {saunas.map((sauna: any) => (
                            <tr key={sauna.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: '500' }}>{sauna.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{sauna.location}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        backgroundColor: sauna.status === 'active' ? '#dcfce7' : '#f1f5f9',
                                        color: sauna.status === 'active' ? '#166534' : '#64748b'
                                    }}>
                                        {sauna.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {sauna.driftStatus === 'closed' ? (
                                        <span style={{ color: '#ef4444', fontWeight: '500' }}>Midlertidig Stengt</span>
                                    ) : (
                                        <span style={{ color: '#16a34a' }}>Åpen</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                        <form action={toggleSaunaStatus.bind(null, sauna.id, sauna.status)}>
                                            <Button size="sm" variant="outline">
                                                {sauna.status === 'active' ? 'Deaktiver' : 'Aktiver'}
                                            </Button>
                                        </form>
                                        <Link href={`/admin/badstuer/${sauna.id}`}>
                                            <Button size="sm" variant="secondary">Rediger</Button>
                                        </Link>
                                        <form action={deleteSauna.bind(null, sauna.id)}>
                                            <Button size="sm" variant="outline" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                                                Slett
                                            </Button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
