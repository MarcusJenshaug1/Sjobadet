import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mdmvybibiaxiezjycqgr.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'impro.usercontent.one',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90], // Match qualities used in components to avoid runtime overhead
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    staleTimes: {
      dynamic: 600, // Keep dynamic pages in router cache for 10 minutes (was 3)
      static: 1800, // Keep static pages in router cache for 30 minutes (was 10)
    },
  },
  outputFileTracingIncludes: {
    '/api/**': ['node_modules/@sparticuz/chromium/**'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  rewrites: async () => {
    return [
      { source: '/storybook', destination: '/storybook/index.html' },
      { source: '/storybook/', destination: '/storybook/index.html' },
    ];
  },
  headers: async () => {
    return [
      {
        source: '/storybook/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          }
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600'
          },
          {
            key: 'Link',
            value: '<https://fonts.gstatic.com>; rel=preconnect; crossorigin, </hero-sjobadet.jpg>; rel=preload; as=image; fetchpriority=high'
          }
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
    ];
  },
};
export default nextConfig;
