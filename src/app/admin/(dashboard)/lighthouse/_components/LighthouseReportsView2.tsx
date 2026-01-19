'use client';

import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, TrendingUp, TrendingDown, Minus, ExternalLink, Search, X, Clock, AlertCircle, CheckCircle2, Activity, Settings, Eye } from 'lucide-react';
import styles from './LighthouseReportsView2.module.css';
import LighthouseDetailedReport from './LighthouseDetailedReport';
import LighthouseStatsComparison from './LighthouseStatsComparison';

interface LighthouseReport {
  id: string;
  url: string;
  device: 'mobile' | 'desktop';
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
  speedIndex?: number;
  createdAt: string;
}

interface LighthouseScan {
  id: string;
  status: 'running' | 'completed' | 'failed';
  totalUrls: number;
  completedUrls: number;
  failedUrls: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

interface GroupedReport {
  url: string;
  mobile?: LighthouseReport;
  desktop?: LighthouseReport;
  latestDate: string;
}

export default function LighthouseReportsView() {
  const [reports, setReports] = useState<LighthouseReport[]>([]);
  const [scans, setScans] = useState<LighthouseScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'performance' | 'url' | 'date'>('performance');
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanOptions, setScanOptions] = useState<{
    homepage: boolean;
    saunas: boolean;
    subpages: boolean;
  }>({
    homepage: true,
    saunas: true,
    subpages: true,
  });
  const [baseUrl, setBaseUrl] = useState('https://sjobadet.marcusjenshaug.no');
  const [tempBaseUrl, setTempBaseUrl] = useState('');
  const [detailedView, setDetailedView] = useState<{ url: string; device: 'mobile' | 'desktop' } | null>(null);
  const [viewMode, setViewMode] = useState<'reports' | 'stats'>('reports');
  const [saunaNames, setSaunaNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReports();
    fetchScans();
    fetchSettings();
    fetchSaunaNames();
    const interval = setInterval(checkScanStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSaunaNames = async () => {
    try {
      const res = await fetch('/api/admin/saunas');
      const data = await res.json();
      if (data.saunaMap) {
        setSaunaNames(data.saunaMap);
      }
    } catch (error) {
      console.error('Failed to fetch sauna names:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/lighthouse/settings');
      const data = await res.json();
      if (data.baseUrl) {
        setBaseUrl(data.baseUrl);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch('/api/lighthouse/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: tempBaseUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setBaseUrl(tempBaseUrl);
        setShowSettings(false);
        alert('Innstillinger lagret! Neste scan vil bruke ny URL.');
      } else {
        alert('Kunne ikke lagre innstillinger');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Nettverksfeil');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/lighthouse/reports');
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/lighthouse/reports?type=scans');
      const data = await res.json();
      setScans(data.scans || []);
    } catch (error) {
      console.error('Failed to fetch scans:', error);
    }
  };

  const checkScanStatus = async () => {
    await fetchScans();
    await fetchReports();
  };

  const startScan = async () => {
    if (scanning) return;
    setScanning(true);
    
    try {
      const res = await fetch('/api/lighthouse/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanOptions),
      });
      const data = await res.json();
      
      if (data.success) {
        setShowScanModal(false);
        setTimeout(() => {
          fetchScans();
          fetchReports();
        }, 2000);
      } else {
        alert('Kunne ikke starte scan:\n\n' + (data.message || data.error));
      }
    } catch (error) {
      console.error('Failed to start scan:', error);
      alert('Nettverksfeil - kunne ikke starte scan.');
    } finally {
      setScanning(false);
    }
  };

  const latestScan = scans[0];
  const isScanning = latestScan?.status === 'running';
  const progress = latestScan ? Math.round((latestScan.completedUrls / latestScan.totalUrls) * 100) : 0;

  // Group reports by URL
  const groupedReports = reports.reduce<Map<string, GroupedReport>>((acc, report) => {
    if (!acc.has(report.url)) {
      acc.set(report.url, {
        url: report.url,
        latestDate: report.createdAt,
      });
    }
    const group = acc.get(report.url)!;
    if (report.device === 'mobile') group.mobile = report;
    if (report.device === 'desktop') group.desktop = report;
    return acc;
  }, new Map());

  let filteredReports = Array.from(groupedReports.values());

  // Apply filters
  if (searchQuery) {
    filteredReports = filteredReports.filter(r =>
      r.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (showOnlyIssues) {
    filteredReports = filteredReports.filter(r => {
      const mobileScore = r.mobile ? (r.mobile.performance + r.mobile.accessibility + r.mobile.bestPractices + r.mobile.seo) / 4 : 100;
      const desktopScore = r.desktop ? (r.desktop.performance + r.desktop.accessibility + r.desktop.bestPractices + r.desktop.seo) / 4 : 100;
      return Math.min(mobileScore, desktopScore) < 90;
    });
  }

  // Sort
  filteredReports.sort((a, b) => {
    if (sortBy === 'url') return a.url.localeCompare(b.url);
    if (sortBy === 'date') return new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime();
    
    // Sort by worst performance
    const aScore = Math.min(
      a.mobile?.performance ?? 100,
      a.desktop?.performance ?? 100
    );
    const bScore = Math.min(
      b.mobile?.performance ?? 100,
      b.desktop?.performance ?? 100
    );
    return aScore - bScore;
  });

  // Calculate KPIs (count unique URLs, not total scans)
  const uniqueUrls = new Set(reports.map(r => r.url)).size;
  const allScores = reports.filter(r => r.performance > 0);
  const avgPerformance = allScores.length ? Math.round(allScores.reduce((sum, r) => sum + r.performance, 0) / allScores.length) : 0;
  const avgAccessibility = allScores.length ? Math.round(allScores.reduce((sum, r) => sum + r.accessibility, 0) / allScores.length) : 0;
  const avgBestPractices = allScores.length ? Math.round(allScores.reduce((sum, r) => sum + r.bestPractices, 0) / allScores.length) : 0;
  const avgSeo = allScores.length ? Math.round(allScores.reduce((sum, r) => sum + r.seo, 0) / allScores.length) : 0;

  const getScoreColor = (score: number) => {
    if (score >= 90) return styles.scoreGood;
    if (score >= 50) return styles.scoreAverage;
    return styles.scorePoor;
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <TrendingUp size={16} />;
    if (score >= 50) return <Minus size={16} />;
    return <TrendingDown size={16} />;
  };

  const getPageName = (url: string): string => {
    const path = url.replace(baseUrl, '') || '/';
    
    const pageNames: Record<string, string> = {
      '/': 'Forside',
      '/info': 'Info',
      '/info/apningstider': 'Åpningstider',
      '/info/faq': 'FAQ',
      '/info/om-oss': 'Om oss',
      '/info/personvern': 'Personvern',
      '/info/regler': 'Regler',
      '/info/vilkar': 'Vilkår',
      '/medlemskap': 'Medlemskap',
      '/bedrift': 'Bedrift',
      '/gavekort': 'Gavekort',
    };

    if (pageNames[path]) {
      return pageNames[path];
    }

    // Handle sauna pages
    if (path.startsWith('/home/')) {
      const slug = path.replace('/home/', '');
      // First, try to get the actual sauna name from the fetched saunaNames map
      if (saunaNames[slug]) {
        return saunaNames[slug];
      }
      // Fallback: decode URL-encoded characters and capitalize
      const decoded = decodeURIComponent(slug);
      return decoded.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    return path;
  };

  const toggleRow = (url: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(url)) {
      newExpanded.delete(url);
    } else {
      newExpanded.add(url);
    }
    setExpandedRows(newExpanded);
  };

  const showDetailedReport = (url: string, device: 'mobile' | 'desktop') => {
    setDetailedView({ url, device });
  };

  // Show detailed view if selected
  if (detailedView) {
    return (
      <LighthouseDetailedReport
        url={detailedView.url}
        device={detailedView.device}
        baseUrl={baseUrl}
        onBack={() => setDetailedView(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <RefreshCw className={styles.spinning} size={32} />
          <p>Laster rapporter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Lighthouse Rapporter</h1>
          <p className={styles.subtitle}>
            Performance · Accessibility · Best Practices · SEO
            <span style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>• {baseUrl}</span>
          </p>
        </div>
        <div className={styles.headerRight}>
          {latestScan && (
            <div className={styles.statusChip}>
              {isScanning ? (
                <>
                  <Activity size={16} className={styles.iconPulse} />
                  <span>{Math.floor(latestScan.completedUrls / 2)}/{Math.floor(latestScan.totalUrls / 2)} sider ({latestScan.completedUrls}/{latestScan.totalUrls} scans)</span>
                </>
              ) : latestScan.status === 'completed' ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Sist: {new Date(latestScan.startedAt).toLocaleDateString('no-NO')}</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Feilet</span>
                </>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', borderRadius: '0.5rem', backgroundColor: '#f0f4f4', padding: '0.25rem' }}>
            <button
              onClick={() => setViewMode('reports')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: viewMode === 'reports' ? 'white' : 'transparent',
                color: viewMode === 'reports' ? '#0f172a' : '#64748b',
                fontWeight: viewMode === 'reports' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Rapporter
            </button>
            <button
              onClick={() => setViewMode('stats')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: viewMode === 'stats' ? 'white' : 'transparent',
                color: viewMode === 'stats' ? '#0f172a' : '#64748b',
                fontWeight: viewMode === 'stats' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Sammenligning
            </button>
          </div>
          <button onClick={() => { setTempBaseUrl(baseUrl); setShowSettings(true); }} className={styles.settingsButton}>
            <Settings size={18} />
            Innstillinger
          </button>
          <button 
            onClick={() => setShowScanModal(true)} 
            disabled={scanning}
            className={`${styles.scanButton} ${scanning ? styles.scanButtonDisabled : ''}`}
          >
            {scanning ? (
              <>
                <RefreshCw className={styles.spinning} size={20} />
                Starter...
              </>
            ) : (
              <>
                <Play size={20} />
                Skann nå
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar (if scanning) */}
      {isScanning && (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Pågående skanning</span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={`${styles.progressFill} ${styles.progressAnimated}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {viewMode === 'stats' ? (
        /* STATS VIEW - New Comparison Component */
        <LighthouseStatsComparison />
      ) : (
        /* REPORTS VIEW */
        <>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${getScoreColor(avgPerformance)}`}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Performance</span>
            {getScoreIcon(avgPerformance)}
          </div>
          <div className={styles.kpiScore}>
            {avgPerformance || '—'}
          </div>
          <div className={styles.kpiFooter}>
            Gjennomsnitt av {uniqueUrls} sider
          </div>
        </div>

        <div className={`${styles.kpiCard} ${getScoreColor(avgAccessibility)}`}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Accessibility</span>
            {getScoreIcon(avgAccessibility)}
          </div>
          <div className={styles.kpiScore}>
            {avgAccessibility || '—'}
          </div>
          <div className={styles.kpiFooter}>
            Gjennomsnitt av {uniqueUrls} sider
          </div>
        </div>

        <div className={`${styles.kpiCard} ${getScoreColor(avgBestPractices)}`}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>Best Practices</span>
            {getScoreIcon(avgBestPractices)}
          </div>
          <div className={styles.kpiScore}>
            {avgBestPractices || '—'}
          </div>
          <div className={styles.kpiFooter}>
            Gjennomsnitt av {uniqueUrls} sider
          </div>
        </div>

        <div className={`${styles.kpiCard} ${getScoreColor(avgSeo)}`}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>SEO</span>
            {getScoreIcon(avgSeo)}
          </div>
          <div className={styles.kpiScore}>
            {avgSeo || '—'}
          </div>
          <div className={styles.kpiFooter}>
            Gjennomsnitt av {uniqueUrls} sider
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Søk URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={styles.clearButton}>
              <X size={16} />
            </button>
          )}
        </div>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className={styles.filterSelect}>
          <option value="performance">Dårligst først</option>
          <option value="url">URL (A-Å)</option>
          <option value="date">Nyeste først</option>
        </select>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={showOnlyIssues}
            onChange={(e) => setShowOnlyIssues(e.target.checked)}
          />
          <span>Vis kun problemer (&lt;90)</span>
        </label>

        <button onClick={() => { setSearchQuery(''); setShowOnlyIssues(false); setSortBy('performance'); }} className={styles.resetButton}>
          Nullstill filtre
        </button>
      </div>

      {/* Reports Table */}
      <div className={styles.tableWrapper}>
        {filteredReports.length === 0 ? (
          <div className={styles.empty}>
            <AlertCircle size={48} />
            <p>Ingen sider matcher filteret</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.urlColumn}>URL</th>
                <th>Performance</th>
                <th>Accessibility</th>
                <th>Best Practices</th>
                <th>SEO</th>
                <th>Sist skannet</th>
                <th className={styles.actionsColumn}></th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((group) => {
                const isExpanded = expandedRows.has(group.url);
                return (
                  <React.Fragment key={group.url}>
                    <tr onClick={() => toggleRow(group.url)} className={styles.tableRow}>
                      <td className={styles.urlCell}>
                        <div className={styles.pageNameWrapper}>
                          <strong className={styles.pageName}>{getPageName(group.url)}</strong>
                          <a href={group.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={styles.urlLink}>
                          {decodeURIComponent(group.url.replace(baseUrl, '') || '/')}
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </td>
                      <td>
                        <div className={styles.scoreCells}>
                          {group.desktop && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.desktop.performance)}`}>
                              D {group.desktop.performance || '—'}
                            </div>
                          )}
                          {group.mobile && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.mobile.performance)}`}>
                              M {group.mobile.performance || '—'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.scoreCells}>
                          {group.desktop && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.desktop.accessibility)}`}>
                              D {group.desktop.accessibility || '—'}
                            </div>
                          )}
                          {group.mobile && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.mobile.accessibility)}`}>
                              M {group.mobile.accessibility || '—'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.scoreCells}>
                          {group.desktop && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.desktop.bestPractices)}`}>
                              D {group.desktop.bestPractices || '—'}
                            </div>
                          )}
                          {group.mobile && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.mobile.bestPractices)}`}>
                              M {group.mobile.bestPractices || '—'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className={styles.scoreCells}>
                          {group.desktop && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.desktop.seo)}`}>
                              D {group.desktop.seo || '—'}
                            </div>
                          )}
                          {group.mobile && (
                            <div className={`${styles.scoreChip} ${getScoreColor(group.mobile.seo)}`}>
                              M {group.mobile.seo || '—'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={styles.dateCell}>
                        <Clock size={14} />
                        {new Date(group.latestDate).toLocaleString('no-NO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className={styles.actionsColumn}>
                        <button className={styles.expandButton}>
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={7}>
                          <div className={styles.expandedContent}>
                            <div className={styles.detailButtons}>
                              {group.mobile && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); showDetailedReport(group.url, 'mobile'); }}
                                  className={styles.detailButton}
                                >
                                  <Eye size={16} />
                                  Se full mobilrapport
                                </button>
                              )}
                              {group.desktop && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); showDetailedReport(group.url, 'desktop'); }}
                                  className={styles.detailButton}
                                >
                                  <Eye size={16} />
                                  Se full desktoprapport
                                </button>
                              )}
                            </div>
                            <div className={styles.metricsGrid}>
                              {group.mobile && (
                                <div className={styles.deviceMetrics}>
                                  <h4>Mobile Web Vitals</h4>
                                  <div className={styles.metricsList}>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.mobile.largestContentfulPaint !== undefined && group.mobile.largestContentfulPaint <= 2500 ? '#dcfce7' : group.mobile.largestContentfulPaint !== undefined && group.mobile.largestContentfulPaint <= 4000 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.mobile.largestContentfulPaint !== undefined && group.mobile.largestContentfulPaint <= 2500 ? '#86efac' : group.mobile.largestContentfulPaint !== undefined && group.mobile.largestContentfulPaint <= 4000 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>LCP:</span>
                                      <strong>{group.mobile.largestContentfulPaint !== undefined ? `${Math.round(group.mobile.largestContentfulPaint)}ms` : '—'}</strong>
                                    </div>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.mobile.firstContentfulPaint !== undefined && group.mobile.firstContentfulPaint <= 1800 ? '#dcfce7' : group.mobile.firstContentfulPaint !== undefined && group.mobile.firstContentfulPaint <= 3000 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.mobile.firstContentfulPaint !== undefined && group.mobile.firstContentfulPaint <= 1800 ? '#86efac' : group.mobile.firstContentfulPaint !== undefined && group.mobile.firstContentfulPaint <= 3000 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>FCP:</span>
                                      <strong>{group.mobile.firstContentfulPaint !== undefined ? `${Math.round(group.mobile.firstContentfulPaint)}ms` : '—'}</strong>
                                    </div>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.mobile.totalBlockingTime !== undefined && group.mobile.totalBlockingTime <= 200 ? '#dcfce7' : group.mobile.totalBlockingTime !== undefined && group.mobile.totalBlockingTime <= 600 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.mobile.totalBlockingTime !== undefined && group.mobile.totalBlockingTime <= 200 ? '#86efac' : group.mobile.totalBlockingTime !== undefined && group.mobile.totalBlockingTime <= 600 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>TBT:</span>
                                      <strong>{group.mobile.totalBlockingTime !== undefined ? `${Math.round(group.mobile.totalBlockingTime)}ms` : '—'}</strong>
                                    </div>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.mobile.cumulativeLayoutShift !== undefined && group.mobile.cumulativeLayoutShift <= 0.1 ? '#dcfce7' : group.mobile.cumulativeLayoutShift !== undefined && group.mobile.cumulativeLayoutShift <= 0.25 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.mobile.cumulativeLayoutShift !== undefined && group.mobile.cumulativeLayoutShift <= 0.1 ? '#86efac' : group.mobile.cumulativeLayoutShift !== undefined && group.mobile.cumulativeLayoutShift <= 0.25 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>CLS:</span>
                                      <strong>{group.mobile.cumulativeLayoutShift !== undefined ? group.mobile.cumulativeLayoutShift.toFixed(3) : '—'}</strong>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {group.desktop && (
                                <div className={styles.deviceMetrics}>
                                  <h4>Desktop Web Vitals</h4>
                                  <div className={styles.metricsList}>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.desktop.largestContentfulPaint !== undefined && group.desktop.largestContentfulPaint <= 2500 ? '#dcfce7' : group.desktop.largestContentfulPaint !== undefined && group.desktop.largestContentfulPaint <= 4000 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.desktop.largestContentfulPaint !== undefined && group.desktop.largestContentfulPaint <= 2500 ? '#86efac' : group.desktop.largestContentfulPaint !== undefined && group.desktop.largestContentfulPaint <= 4000 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>LCP:</span>
                                      <strong>{group.desktop.largestContentfulPaint !== undefined ? `${Math.round(group.desktop.largestContentfulPaint)}ms` : '—'}</strong>
                                    </div>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.desktop.firstContentfulPaint !== undefined && group.desktop.firstContentfulPaint <= 1800 ? '#dcfce7' : group.desktop.firstContentfulPaint !== undefined && group.desktop.firstContentfulPaint <= 3000 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.desktop.firstContentfulPaint !== undefined && group.desktop.firstContentfulPaint <= 1800 ? '#86efac' : group.desktop.firstContentfulPaint !== undefined && group.desktop.firstContentfulPaint <= 3000 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>FCP:</span>
                                      <strong>{group.desktop.firstContentfulPaint !== undefined ? `${Math.round(group.desktop.firstContentfulPaint)}ms` : '—'}</strong>
                                    </div>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.desktop.totalBlockingTime !== undefined && group.desktop.totalBlockingTime <= 200 ? '#dcfce7' : group.desktop.totalBlockingTime !== undefined && group.desktop.totalBlockingTime <= 600 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.desktop.totalBlockingTime !== undefined && group.desktop.totalBlockingTime <= 200 ? '#86efac' : group.desktop.totalBlockingTime !== undefined && group.desktop.totalBlockingTime <= 600 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>TBT:</span>
                                      <strong>{group.desktop.totalBlockingTime !== undefined ? `${Math.round(group.desktop.totalBlockingTime)}ms` : '—'}</strong>
                                    </div>
                                    <div className={styles.metricItem} style={{
                                      backgroundColor: group.desktop.cumulativeLayoutShift !== undefined && group.desktop.cumulativeLayoutShift <= 0.1 ? '#dcfce7' : group.desktop.cumulativeLayoutShift !== undefined && group.desktop.cumulativeLayoutShift <= 0.25 ? '#fef3c7' : '#fee2e2',
                                      borderColor: group.desktop.cumulativeLayoutShift !== undefined && group.desktop.cumulativeLayoutShift <= 0.1 ? '#86efac' : group.desktop.cumulativeLayoutShift !== undefined && group.desktop.cumulativeLayoutShift <= 0.25 ? '#fcd34d' : '#fca5a5'
                                    }}>
                                      <span>CLS:</span>
                                      <strong>{group.desktop.cumulativeLayoutShift !== undefined ? group.desktop.cumulativeLayoutShift.toFixed(3) : '—'}</strong>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detailed Progress */}
      {isScanning && latestScan && (
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <Activity size={20} className={styles.iconPulse} />
            <div>
              <h3 className={styles.progressTitle}>Scanning i progress...</h3>
              <p className={styles.progressMeta}>
                {Math.floor(latestScan.completedUrls / 2)} av {Math.floor(latestScan.totalUrls / 2)} sider ({latestScan.completedUrls} av {latestScan.totalUrls} scans)
              </p>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${(latestScan.completedUrls / latestScan.totalUrls) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Lighthouse Innstillinger</h2>
              <button onClick={() => setShowSettings(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Base URL for scanning</label>
              <input
                type="text"
                value={tempBaseUrl}
                onChange={(e) => setTempBaseUrl(e.target.value)}
                placeholder="https://eksempel.no"
                className={styles.formInput}
              />
              <p className={styles.formHelp}>
                URL-en som skal scannes. Alle sider vil bli scannet fra dette domenet.
              </p>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowSettings(false)} className={`${styles.modalButton} ${styles.modalButtonSecondary}`}>
                Avbryt
              </button>
              <button onClick={saveSettings} className={`${styles.modalButton} ${styles.modalButtonPrimary}`}>
                Lagre innstillinger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scan Options Modal */}
      {showScanModal && (
        <div className={styles.modalOverlay} onClick={() => setShowScanModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Velg sider å skanne</h2>
              <button onClick={() => setShowScanModal(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={scanOptions.homepage && scanOptions.saunas && scanOptions.subpages}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setScanOptions({ homepage: checked, saunas: checked, subpages: checked });
                  }}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Alle sider</span>
              </label>
              <p className={styles.formHelp} style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                Skann alle sider (forside, badstuer og undersider)
              </p>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={scanOptions.homepage}
                    onChange={(e) => setScanOptions({ ...scanOptions, homepage: e.target.checked })}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Forside</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={scanOptions.saunas}
                    onChange={(e) => setScanOptions({ ...scanOptions, saunas: e.target.checked })}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Badstuesider</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={scanOptions.subpages}
                    onChange={(e) => setScanOptions({ ...scanOptions, subpages: e.target.checked })}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Undersider</span>
                </label>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowScanModal(false)} className={`${styles.modalButton} ${styles.modalButtonSecondary}`}>
                Avbryt
              </button>
              <button 
                onClick={startScan} 
                disabled={!scanOptions.homepage && !scanOptions.saunas && !scanOptions.subpages}
                className={`${styles.modalButton} ${styles.modalButtonPrimary}`}
              >
                Start scanning
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
