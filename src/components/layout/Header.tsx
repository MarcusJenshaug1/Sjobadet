import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { HeaderView } from './HeaderView';
import { AlertBar } from './AlertBar';

export const revalidate = 300;

export async function Header() {
    let isAdmin = false;
    let isMaintenanceMode = false;

    try {
        const [session, maintenanceSetting] = await Promise.all([
            getSession(),
            prisma.siteSetting.findUnique({
                where: { key: 'maintenance_mode' }
            })
        ]);
        isAdmin = !!session?.user;
        isMaintenanceMode = maintenanceSetting?.value === 'true';
    } catch (error) {
        console.error('Error in Header fetching:', error);
    }

    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
            <AlertBar />
            <HeaderView isAdmin={isAdmin} isMaintenanceMode={isMaintenanceMode} />
        </div>
    );
}
