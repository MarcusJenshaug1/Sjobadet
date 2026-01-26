import prisma from './prisma';

export type LogStatus = 'SUCCESS' | 'FAILURE' | 'WARNING' | 'INFO' | 'OK';

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
        // Use type-safe access where possible
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    } catch {
        // Silent fail for logging errors
    }
}
