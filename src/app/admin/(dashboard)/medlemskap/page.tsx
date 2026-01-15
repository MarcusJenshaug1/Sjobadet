import prisma from '@/lib/prisma'
import SubscriptionForm from './_components/SubscriptionForm'

export default async function AdminMembershipsPage() {
    const subscriptions = await prisma.subscription.findMany({
        orderBy: { sorting: 'asc' }
    })

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Abonnementer</h1>

            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#555' }}>Opprett nytt</h2>
                <SubscriptionForm />
            </div>

            <div style={{ borderTop: '2px solid #eee', paddingTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#555' }}>Eksisterende abonnementer</h2>

                {subscriptions.length === 0 && <p>Ingen abonnementer funnet.</p>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {subscriptions.map(sub => (
                        <SubscriptionForm key={sub.id} sub={sub} />
                    ))}
                </div>
            </div>
        </div>
    )
}
