import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { HeaderView } from './HeaderView';
import { AlertBar } from './AlertBar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function Header() {
    let isAdmin = false;
    let isMaintenanceMode = false;
    
    try {
        const session = await getSession();
        isAdmin = !!session?.user;
    } catch (error) {
        console.error('Failed to get session in Header:', error);
    }

    try {
        const maintenanceSetting = await prisma.siteSetting.findUnique({
            where: { key: 'maintenance_mode' }
        });
        isMaintenanceMode = maintenanceSetting?.value === 'true';
    } catch (error) {
        console.error('Failed to check maintenance mode:', error);
    }

    return (
        <div style={{ position: 'sticky', top: 0, zIndex: 1100, width: '100%' }}>
            <AlertBar />
            <HeaderView isAdmin={isAdmin} isMaintenanceMode={isMaintenanceMode} />
        </div>
    );
}
