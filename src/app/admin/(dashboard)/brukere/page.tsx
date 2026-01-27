import prisma from '@/lib/prisma'
import UserList from './_components/UserList'

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await prisma.adminUser.findMany({
        orderBy: {
            username: 'asc'
        },
        select: {
            id: true,
            username: true,
            avatarUrl: true,
            role: true,
            createdAt: true
        }
    })

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Administratorer</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                Administrer tilgang til admin-panelet.
            </p>
            <UserList initialUsers={users} />
        </div>
    )
}
