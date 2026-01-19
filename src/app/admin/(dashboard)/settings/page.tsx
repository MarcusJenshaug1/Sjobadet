import prisma from '@/lib/prisma'
import { PageWrapper } from '@/components/admin/PageWrapper'
import OperationsManager from './_components/OperationsManager'
import SettingsForm from './_components/SettingsForm'
import MaintenanceMode from './_components/MaintenanceMode'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const settings = await prisma.siteSetting.findMany()
    const settingsMap = settings.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value
        return acc
    }, {} as Record<string, string>)

    const maintenanceModeEnabled = settingsMap['maintenance_mode'] === 'true'
    const lastSnapshot = settingsMap['maintenance_snapshot'] 
        ? new Date(JSON.parse(settingsMap['maintenance_snapshot']).generatedAt).toISOString()
        : null

    return (
        <PageWrapper layout="narrow" title="Innstillinger">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '5rem' }}>

                {/* Section A: Vedlikeholdsmodus */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
                        Vedlikeholdsmodus
                    </h2>
                    <MaintenanceMode isEnabled={maintenanceModeEnabled} lastSnapshot={lastSnapshot} />
                </section>

                {/* Section B: Drift & Ytelse */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
                        Operasjoner
                    </h2>
                    <OperationsManager />
                </section>

                {/* Section C: Innholdsinnstillinger */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
                        Innhold & Konfigurasjon
                    </h2>
                    <SettingsForm initialSettings={settingsMap} />
                </section>

            </div>
        </PageWrapper>
    )
}
