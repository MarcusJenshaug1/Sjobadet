import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch base URL from settings, fallback to production URL
    let baseUrl = 'https://sjobadet.net';

    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key: 'lighthouse_base_url' },
        });
        if (setting?.value) {
            baseUrl = setting.value;
        }
    } catch {
        console.warn('Failed to fetch base URL from settings for sitemap, using default');
    }

    const staticRoutes = [
        '',
        '/medlemskap',
        '/gavekort',
        '/bedrift',
        '/info',
        '/info/faq',
        '/info/regler',
        '/info/vilkar',
        '/info/om-oss',
        '/info/apningstider',
        '/info/personvern',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        const saunas = await prisma.sauna.findMany({
            where: { status: 'active' },
            select: { slug: true, updatedAt: true }
        });

        const saunaRoutes = saunas.map((sauna) => ({
            url: `${baseUrl}/home/${sauna.slug}`,
            lastModified: sauna.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        return [...staticRoutes, ...saunaRoutes];
    } catch {
        // If database is not available during build (e.g., in CI/CD), return static routes only
        console.warn('Database not available for sitemap generation, returning static routes only');
        return staticRoutes;
    }
}
