import prisma from './prisma';

export type LogStatus = 'SUCCESS' | 'FAILURE' | 'WARNING';

/**
 * Logs an administrative or background action to the AdminLog table.
 * This log is visible in the Admin Dashboard "Logg & Historikk" section.
 */
export async function logAdminAction(
    action: string,
    details: string,
    status: LogStatus = 'SUCCESS',
    performedBy: string = 'System'
) {
    try {
        // Use type casting since AdminLog might not be fully typed in all environments
        const adminLog = (prisma as any).adminLog;
        if (adminLog) {
            await adminLog.create({
                data: {
                    action,
                    details,
                    status,
                    performedBy
                }
            });
        }
    } catch (e) {
        console.error('Failed to create admin log:', e);
    }
}
