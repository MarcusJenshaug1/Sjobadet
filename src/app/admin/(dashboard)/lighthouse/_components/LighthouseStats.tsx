'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import Link from 'next/link';

interface LighthouseReport {
  id: string;
  url: string;
  device: 'mobile' | 'desktop';
  performance: number;
  createdAt: string;
}

interface StatsData {
  latestMobileScore: number;
  latestDesktopScore: number;
  previousMobileScore?: number;
  previousDesktopScore?: number;
  totalReports: number;
  uniqueUrls: number;
}

export default function LighthouseStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/lighthouse/reports');
      const data = await res.json();
      const reports = (data.reports || []) as LighthouseReport[];

      if (reports.length === 0) {
        setStats(null);
        setLoading(false);
        return;
      }

      // Group by URL and device
      const grouped: Record<string, Record<string, LighthouseReport[]>> = {};
      reports.forEach((report) => {
        if (!grouped[report.url]) grouped[report.url] = {};
        if (!grouped[report.url][report.device]) grouped[report.url][report.device] = [];
        grouped[report.url][report.device].push(report);
      });

      // Sort by date and get latest for each URL/device
      let latestMobileScores: number[] = [];
      let latestDesktopScores: number[] = [];
      let previousMobileScores: number[] = [];
      let previousDesktopScores: number[] = [];

      Object.values(grouped).forEach((deviceMap) => {
        // Mobile
        if (deviceMap.mobile) {
          const sorted = deviceMap.mobile.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          if (sorted[0]) latestMobileScores.push(sorted[0].performance);
          if (sorted[1]) previousMobileScores.push(sorted[1].performance);
        }
        // Desktop
        if (deviceMap.desktop) {
          const sorted = deviceMap.desktop.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          if (sorted[0]) latestDesktopScores.push(sorted[0].performance);
          if (sorted[1]) previousDesktopScores.push(sorted[1].performance);
        }
      });

      const avgLatestMobile =
        latestMobileScores.length > 0
          ? Math.round(
              latestMobileScores.reduce((a, b) => a + b, 0) / latestMobileScores.length
            )
          : 0;
      const avgLatestDesktop =
        latestDesktopScores.length > 0
          ? Math.round(
              latestDesktopScores.reduce((a, b) => a + b, 0) / latestDesktopScores.length
            )
          : 0;
      const avgPreviousMobile =
        previousMobileScores.length > 0
          ? Math.round(
              previousMobileScores.reduce((a, b) => a + b, 0) / previousMobileScores.length
            )
          : undefined;
      const avgPreviousDesktop =
        previousDesktopScores.length > 0
          ? Math.round(
              previousDesktopScores.reduce((a, b) => a + b, 0) / previousDesktopScores.length
            )
          : undefined;

      setStats({
        latestMobileScore: avgLatestMobile,
        latestDesktopScore: avgLatestDesktop,
        previousMobileScore: avgPreviousMobile,
        previousDesktopScore: avgPreviousDesktop,
        totalReports: reports.length,
        uniqueUrls: Object.keys(grouped).length,
      });
    } catch (error) {
      console.error('Failed to fetch Lighthouse stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#64748b' }}>Laster Lighthouse-statistikk...</div>;
  }

  if (!stats) {
    return (
      <div style={{ color: '#64748b' }}>
        Ingen Lighthouse-rapporter funnet. <Link href="/admin/lighthouse">Start en scan</Link>
      </div>
    );
  }

  const getMobileChange = () => {
    if (!stats.previousMobileScore) return null;
    return stats.latestMobileScore - stats.previousMobileScore;
  };

  const getDesktopChange = () => {
    if (!stats.previousDesktopScore) return null;
    return stats.latestDesktopScore - stats.previousDesktopScore;
  };

  const mobileChange = getMobileChange();
  const desktopChange = getDesktopChange();

  const getTrendColor = (change: number | null): string => {
    if (change === null) return '#6b7280';
    if (change > 0) return '#16a34a';
    if (change < 0) return '#dc2626';
    return '#f59e0b';
  };

  const getTrendIcon = (change: number | null) => {
    if (change === null) return <Minus size={16} />;
    if (change > 0) return <TrendingUp size={16} />;
    if (change < 0) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  return (
    <Link href="/admin/lighthouse" style={{ textDecoration: 'none' }}>
      <div
        style={{
          padding: '1.25rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          border: '1px solid #edf2f7',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)';
          e.currentTarget.style.borderColor = '#edf2f7';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={20} color="#7c3aed" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              Lighthouse Performance
            </h3>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>
            Siste scan
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
          {/* Mobile */}
          <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Mobil
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>
                {stats.latestMobileScore}
              </span>
              {mobileChange !== null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: getTrendColor(mobileChange),
                  }}
                >
                  {getTrendIcon(mobileChange)}
                  {Math.abs(mobileChange)}
                </div>
              )}
            </div>
          </div>

          {/* Desktop */}
          <div style={{ backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
              Desktop
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937' }}>
                {stats.latestDesktopScore}
              </span>
              {desktopChange !== null && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: getTrendColor(desktopChange),
                  }}
                >
                  {getTrendIcon(desktopChange)}
                  {Math.abs(desktopChange)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6b7280', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
          {stats.totalReports} rapporter · {stats.uniqueUrls} URLs
        </div>
      </div>
    </Link>
  );
}
