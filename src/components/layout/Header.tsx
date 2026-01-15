import { getSession } from '@/lib/auth';
import { HeaderView } from './HeaderView';

export async function Header() {
    const session = await getSession();
    const isAdmin = !!session?.user;

    return <HeaderView isAdmin={isAdmin} />;
}
