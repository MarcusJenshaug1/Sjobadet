import { getSession } from '@/lib/auth';
import { HeaderView } from './HeaderView';

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
