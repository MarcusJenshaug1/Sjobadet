import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ClearDemoLogButton, DeleteDemoLogButton } from './DemoLogActions'

export const dynamic = 'force-dynamic'

const MARCUS_USER_ID = 'cmkfd6c5l0000gmleddopok2f'

async function requireMarcusAdmin() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/admin/login?next=/admin/demo-logg')
  }

  if (session.user.role !== 'admin' || session.user.id !== MARCUS_USER_ID) {
    redirect('/admin')
  }

  return session
}

async function clearDemoLogs() {
  'use server'

  await requireMarcusAdmin()
  await prisma.adminLog.deleteMany({ where: { action: 'DEMO_LOGIN' } })
}

async function deleteDemoLog(logId: string) {
  'use server'

  await requireMarcusAdmin()
  await prisma.adminLog.delete({ where: { id: logId } })
}

export default async function DemoLoggPage() {
  await requireMarcusAdmin()

  const logs = await prisma.adminLog.findMany({
    where: { action: 'DEMO_LOGIN' },
    orderBy: { createdAt: 'desc' },
    take: 200
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Demo-logg</h1>
          <p style={{ color: '#64748b' }}>
            Innlogginger med demo-bruker (siste 200).
          </p>
        </div>
        <ClearDemoLogButton action={clearDemoLogs} />
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.75rem', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 140px 120px', padding: '0.75rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <div>Tidspunkt</div>
          <div>Detaljer</div>
          <div>Utført av</div>
          <div>Handling</div>
        </div>
        {logs.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Ingen demo-innlogginger logget enda.
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 140px 120px', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                {new Date(log.createdAt).toLocaleString('no-NO')}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>
                {log.details || 'Demo innlogging'}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {log.performedBy || 'Ukjent'}
              </div>
              <div>
                <DeleteDemoLogButton logId={log.id} action={deleteDemoLog} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
