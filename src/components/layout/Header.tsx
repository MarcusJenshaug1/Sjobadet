import { getSession } from '@/lib/auth';
import { HeaderView } from './HeaderView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function Header() {
    let isAdmin = false;
    try {
        const session = await getSession();
        isAdmin = !!session?.user;
    } catch (error) {
        console.error('Failed to get session in Header:', error);
    }

    return <HeaderView isAdmin={isAdmin} />;
}
