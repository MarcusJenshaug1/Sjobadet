import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { HeaderView } from './HeaderView';
import { AlertBar } from './AlertBar';
import { getActiveSaunas, ActiveSauna } from '@/lib/sauna-service';
import { getPopularityStats } from '@/lib/analytics/popular-routes';

export const revalidate = 300;

export async function Header() {
    let isAdmin = false;
    let isMaintenanceMode = false;
    let saunas: ActiveSauna[] = [];
    let popularity: Record<string, number> = {};

    try {
        const [session, maintenanceSetting, saunasData, stats] = await Promise.all([
            getSession(),
            prisma.siteSetting.findUnique({
                where: { key: 'maintenance_mode' }
            }),
            getActiveSaunas(),
            getPopularityStats()
        ]);

        isAdmin = !!session?.user;
        isMaintenanceMode = maintenanceSetting?.value === 'true';
        saunas = saunasData;
        popularity = stats;
    } catch {
        // Silently fail for header fetching to prevent entire page crash
    }

    // Sort saunas by popularity
    const sortedSaunas = saunas.map(s => ({
        label: s.name,
        href: `/home/${s.slug}`,
        views: popularity[`/home/${s.slug}`] || 0
    })).sort((a, b) => b.views - a.views);

    // Info links to be used in dropdown
    const infoLinks = [
        { label: 'Ofte stilte spørsmål', href: '/info/faq' },
        { label: 'Badstueregler', href: '/info/regler' },
        { label: 'Salgsbetingelser', href: '/info/vilkar' },
        { label: 'Bedriftsmedlemskap', href: '/bedrift' },
        { label: 'Om oss', href: '/info/om-oss' },
        { label: 'Åpningstider', href: '/info/apningstider' },
    ].map(link => ({
        ...link,
        views: popularity[link.href] || 0
    })).sort((a, b) => b.views - a.views);

    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
            <AlertBar />
            <HeaderView
                isAdmin={isAdmin}
                isMaintenanceMode={isMaintenanceMode}
                saunaLinks={sortedSaunas}
                infoLinks={infoLinks}
            />
        </div>
    );
}
