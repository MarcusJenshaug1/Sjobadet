import { getDashboardStats, getDriftStatus, getRecentActivity } from './dashboard-actions'
import DashboardAlerts from './_components/DashboardAlerts'
import DriftStatus from './_components/DriftStatus'
import ActionableKPIs from './_components/ActionableKPIs'
import RecentActivity from './_components/RecentActivity'
import QuickActions from './_components/QuickActions'

export default async function AdminDashboard() {
    const [stats, drift, logs] = await Promise.all([
        getDashboardStats(),
        getDriftStatus(),
        getRecentActivity(10)
    ])

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>Oversikt</h1>

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
