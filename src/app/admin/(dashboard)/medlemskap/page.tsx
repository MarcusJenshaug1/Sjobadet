import prisma from '@/lib/prisma'
import SubscriptionList from './_components/SubscriptionList'

export const dynamic = 'force-dynamic';

export default async function AdminMembershipsPage() {
    const subscriptions = await prisma.subscription.findMany({
        orderBy: { sorting: 'asc' }
    })

    const serializedSubscriptions = subscriptions.map((sub: any) => ({
        ...sub,
        description: sub.description ?? undefined,
        bindingDescription: sub.bindingDescription ?? undefined,
        paymentUrl: sub.paymentUrl ?? undefined
    }))

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Abonnementer</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Administrer medlemskap og abonnementer som vises på nettsiden.
            </p>
            <SubscriptionList initialSubscriptions={serializedSubscriptions} />
        </div>
    )
}
