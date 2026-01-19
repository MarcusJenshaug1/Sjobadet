import { listMediaItems } from './actions'
import MediaGrid from './_components/MediaGrid'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
    // We fetch grouped by default, the Grid component can handle toggling by filter/state if we want,
    // but here we just fetch the initially grouped set.
    const items = await listMediaItems(true)

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>Bildegalleri</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        Administrasjon av alle bilder i Sjøbadet.
                    </p>
                </div>
            </div>

            <MediaGrid initialItems={items} />
        </div>
    )
}
