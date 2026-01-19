import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LighthouseReportsView from './_components/LighthouseReportsView2';
import { PageWrapper } from '@/components/admin/PageWrapper';

export const dynamic = 'force-dynamic';

export default async function LighthousePage() {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <PageWrapper layout="fluid">
      <LighthouseReportsView />
    </PageWrapper>
  );
}
