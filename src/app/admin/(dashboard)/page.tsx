import { getDashboardStats, getDriftStatus, getRecentActivity } from './dashboard-actions'
import DashboardAlerts from './_components/DashboardAlerts'
import DriftStatus from './_components/DriftStatus'
import ActionableKPIs from './_components/ActionableKPIs'
import RecentActivity from './_components/RecentActivity'
import QuickActions from './_components/QuickActions'
import { Users } from 'lucide-react'

export default async function AdminDashboard() {
    const [stats, drift, logs] = await Promise.all([
        getDashboardStats(),
        getDriftStatus(),
        getRecentActivity(5) // Changed to 5 max
    ])

    const activeSessions = drift.privacyStats?.activeSessions || 0

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Oversikt</h1>
                
                {/* Active Users Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <Users size={18} />
                    <span>{activeSessions}</span>
                    <span style={{ opacity: 0.9 }}>aktive brukere</span>
                </div>
            </div>

            {/* 1. Alerts & Status */}
            <DashboardAlerts
                pendingMedia={stats.pendingMedia}
                cacheStats={drift.cacheStats}
                lastPreload={drift.lastPreload}
            />

            {/* 2. Drift & Operations */}
            <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Driftstatus</h2>
                <DriftStatus
                    lastCacheClear={drift.lastCacheClear}
                    lastPreload={drift.lastPreload}
                    cacheStats={drift.cacheStats}
                    lighthouse={drift.lighthouse}
                    privacyStats={drift.privacyStats}
                />
            </div>

            {/* 3. Main KPIs */}
            <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nøkkeltall</h2>
                <ActionableKPIs stats={stats} />
            </div>

            {/* 4. Activity & Shortcuts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ flex: 2 }}>
                    <RecentActivity logs={logs} />
                </div>
                <div style={{ flex: 1 }}>
                    <QuickActions />
                </div>
            </div>
        </div>
    )
}
