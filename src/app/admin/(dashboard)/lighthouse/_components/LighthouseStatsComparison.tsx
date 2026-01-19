'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Minus, Download, Filter, 
  Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Grid3x3, List, SplitSquareHorizontal, ChevronDown, ChevronUp,
  Smartphone, Monitor, Layers
} from 'lucide-react';
import styles from './LighthouseStatsComparison.module.css';

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

type ComparisonMode = 'last-vs-previous' | 'custom-dates' | 'trend-7d' | 'trend-30d';
type DeviceFilter = 'mobile' | 'desktop' | 'both';
type ViewMode = 'cards' | 'table';
type GroupFilter = 'all' | 'regressions' | 'improvements' | 'unchanged' | 'insufficient-data';

interface ComparisonData {
  url: string;
  device: 'mobile' | 'desktop';
  current: LighthouseReport;
  previous?: LighthouseReport;
  delta: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    lcp?: number;
    cls?: number;
    tbt?: number;
    fcp?: number;
    speedIndex?: number;
  };
  status: 'regression' | 'improvement' | 'unchanged';
  history: LighthouseReport[];
}

export default function LighthouseStatsComparison() {
  const [reports, setReports] = useState<LighthouseReport[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Comparison controls
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('last-vs-previous');
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>('both');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all');
  
  // Filters
  const [showOnlyRegressions, setShowOnlyRegressions] = useState(false);
  const [sortBy, setSortBy] = useState<'delta-performance' | 'delta-seo' | 'worst-score' | 'url'>('delta-performance');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expanded rows for table view
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchReports();
  }, []);

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

  // Calculate comparison data
  const comparisonData = useMemo(() => {
    if (reports.length === 0) return [];

    // Group reports by URL and device
    const grouped = new Map<string, LighthouseReport[]>();
    reports.forEach(report => {
      const key = `${report.url}-${report.device}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(report);
    });

    // Sort each group by date (newest first)
    grouped.forEach(group => {
      group.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    // Build comparison data
    const comparisons: ComparisonData[] = [];
    grouped.forEach((history, key) => {
      if (history.length < 2) return; // Skip if insufficient data
      
      const current = history[0];
      const previous = history[1];

      const delta = {
        performance: current.performance - previous.performance,
        accessibility: current.accessibility - previous.accessibility,
        bestPractices: current.bestPractices - previous.bestPractices,
        seo: current.seo - previous.seo,
        lcp: current.largestContentfulPaint && previous.largestContentfulPaint 
          ? current.largestContentfulPaint - previous.largestContentfulPaint 
          : undefined,
        cls: current.cumulativeLayoutShift && previous.cumulativeLayoutShift
          ? current.cumulativeLayoutShift - previous.cumulativeLayoutShift
          : undefined,
        tbt: current.totalBlockingTime && previous.totalBlockingTime
          ? current.totalBlockingTime - previous.totalBlockingTime
          : undefined,
        fcp: current.firstContentfulPaint && previous.firstContentfulPaint
          ? current.firstContentfulPaint - previous.firstContentfulPaint
          : undefined,
        speedIndex: current.speedIndex && previous.speedIndex
          ? current.speedIndex - previous.speedIndex
          : undefined,
      };

      // Determine status (regression if any main metric drops > 5 points)
      let status: 'regression' | 'improvement' | 'unchanged' = 'unchanged';
      const avgDelta = (delta.performance + delta.accessibility + delta.bestPractices + delta.seo) / 4;
      if (avgDelta < -5) status = 'regression';
      else if (avgDelta > 5) status = 'improvement';

      comparisons.push({
        url: current.url,
        device: current.device,
        current,
        previous,
        delta,
        status,
        history,
      });
    });

    return comparisons;
  }, [reports, comparisonMode]);

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = [...comparisonData];

    // Device filter
    if (deviceFilter !== 'both') {
      filtered = filtered.filter(d => d.device === deviceFilter);
    }

    // Group filter
    if (groupFilter !== 'all') {
      filtered = filtered.filter(d => {
        if (groupFilter === 'regressions') return d.status === 'regression';
        if (groupFilter === 'improvements') return d.status === 'improvement';
        if (groupFilter === 'unchanged') return d.status === 'unchanged';
        return true;
      });
    }

    // Regressions only toggle
    if (showOnlyRegressions) {
      filtered = filtered.filter(d => d.status === 'regression');
    }

    // Search query
    if (searchQuery) {
      filtered = filtered.filter(d =>
        d.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'delta-performance') return a.delta.performance - b.delta.performance;
      if (sortBy === 'delta-seo') return a.delta.seo - b.delta.seo;
      if (sortBy === 'worst-score') return a.current.performance - b.current.performance;
      return a.url.localeCompare(b.url);
    });

    return filtered;
  }, [comparisonData, deviceFilter, groupFilter, showOnlyRegressions, searchQuery, sortBy]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (filteredData.length === 0) return null;

    const avgPerformance = filteredData.reduce((sum, d) => sum + d.current.performance, 0) / filteredData.length;
    const avgPerfDelta = filteredData.reduce((sum, d) => sum + d.delta.performance, 0) / filteredData.length;
    
    const avgSeo = filteredData.reduce((sum, d) => sum + d.current.seo, 0) / filteredData.length;
    const avgSeoDelta = filteredData.reduce((sum, d) => sum + d.delta.seo, 0) / filteredData.length;

    const regressions = filteredData.filter(d => d.status === 'regression').length;
    const improvements = filteredData.filter(d => d.status === 'improvement').length;

    return { avgPerformance, avgPerfDelta, avgSeo, avgSeoDelta, regressions, improvements };
  }, [filteredData]);

  const exportData = () => {
    const csv = [
      ['URL', 'Enhet', 'Performance (Nå)', 'Performance (Før)', 'Δ Perf', 'SEO (Nå)', 'SEO (Før)', 'Δ SEO', 'LCP Δ', 'CLS Δ', 'TBT Δ', 'Status'].join(','),
      ...filteredData.map(d => [
        d.url,
        d.device,
        d.current.performance,
        d.previous?.performance || '',
        d.delta.performance.toFixed(1),
        d.current.seo,
        d.previous?.seo || '',
        d.delta.seo.toFixed(1),
        d.delta.lcp?.toFixed(0) || '',
        d.delta.cls?.toFixed(3) || '',
        d.delta.tbt?.toFixed(0) || '',
        d.status,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lighthouse-comparison-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const toggleRow = (key: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  const formatPageName = (url: string): string => {
    const path = url.replace(/^https?:\/\/[^/]+/, '') || '/';
    
    // Handle sauna pages
    if (path.startsWith('/home/')) {
      const slug = path.replace('/home/', '');
      // Decode URL-encoded characters (e.g., %C3%B8 → ø)
      try {
        const decoded = decodeURIComponent(slug);
        return decoded.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      } catch {
        return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
    }

    return path;
  };

  if (loading) {
    return <div className={styles.container}>Laster sammenligning...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Sticky comparison toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarSection}>
          <label className={styles.toolbarLabel}>Enhet:</label>
          <div className={styles.segmentedControl}>
            <button
              className={deviceFilter === 'mobile' ? styles.active : ''}
              onClick={() => setDeviceFilter('mobile')}
            >
              <Smartphone size={16} />
              <span>Mobil</span>
            </button>
            <button
              className={deviceFilter === 'desktop' ? styles.active : ''}
              onClick={() => setDeviceFilter('desktop')}
            >
              <Monitor size={16} />
              <span>Desktop</span>
            </button>
            <button
              className={deviceFilter === 'both' ? styles.active : ''}
              onClick={() => setDeviceFilter('both')}
            >
              <Layers size={16} />
              <span>Begge</span>
            </button>
          </div>
        </div>

        <div className={styles.toolbarSection}>
          <label className={styles.toolbarLabel}>Sammenligning:</label>
          <select
            className={styles.select}
            value={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.value as ComparisonMode)}
          >
            <option value="last-vs-previous">Siste vs forrige</option>
            <option value="custom-dates">Velg to datoer</option>
            <option value="trend-7d">Siste 7 dager</option>
            <option value="trend-30d">Siste 30 dager</option>
          </select>
        </div>

        <div className={styles.toolbarSection}>
          <label className={styles.toolbarLabel}>Sortering:</label>
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="delta-performance">Største fall (Performance)</option>
            <option value="delta-seo">Største fall (SEO)</option>
            <option value="worst-score">Dårligst score</option>
            <option value="url">URL (alfabetisk)</option>
          </select>
        </div>

        <div className={styles.toolbarSection}>
          <button
            className={`${styles.filterButton} ${showOnlyRegressions ? styles.active : ''}`}
            onClick={() => setShowOnlyRegressions(!showOnlyRegressions)}
          >
            <Filter size={16} />
            Kun regresjoner
          </button>
        </div>

        <div className={styles.toolbarSection}>
          <button className={styles.exportButton} onClick={exportData}>
            <Download size={16} />
            Eksporter CSV
          </button>
        </div>

        <div className={styles.toolbarSection}>
          <div className={styles.viewToggle}>
            <button
              className={viewMode === 'cards' ? styles.active : ''}
              onClick={() => setViewMode('cards')}
              title="Kortvisning"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              className={viewMode === 'table' ? styles.active : ''}
              onClick={() => setViewMode('table')}
              title="Tabellvisning"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      {kpis && (
        <div className={styles.kpiRow}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Snitt Performance</div>
            <div className={styles.kpiValue}>{kpis.avgPerformance.toFixed(0)}</div>
            <div className={`${styles.kpiDelta} ${kpis.avgPerfDelta >= 0 ? styles.positive : styles.negative}`}>
              {kpis.avgPerfDelta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.avgPerfDelta >= 0 ? '+' : ''}{kpis.avgPerfDelta.toFixed(1)}
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Snitt SEO</div>
            <div className={styles.kpiValue}>{kpis.avgSeo.toFixed(0)}</div>
            <div className={`${styles.kpiDelta} ${kpis.avgSeoDelta >= 0 ? styles.positive : styles.negative}`}>
              {kpis.avgSeoDelta >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {kpis.avgSeoDelta >= 0 ? '+' : ''}{kpis.avgSeoDelta.toFixed(1)}
            </div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Regresjoner</div>
            <div className={`${styles.kpiValue} ${styles.warning}`}>
              <AlertTriangle size={20} />
              {kpis.regressions}
            </div>
            <div className={styles.kpiSubtext}>{kpis.regressions} sider forverret</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Forbedringer</div>
            <div className={`${styles.kpiValue} ${styles.success}`}>
              <CheckCircle size={20} />
              {kpis.improvements}
            </div>
            <div className={styles.kpiSubtext}>{kpis.improvements} sider forbedret</div>
          </div>
        </div>
      )}

      {/* Group filter tabs */}
      <div className={styles.groupTabs}>
        <button
          className={groupFilter === 'all' ? styles.activeTab : ''}
          onClick={() => setGroupFilter('all')}
        >
          Alle ({comparisonData.length})
        </button>
        <button
          className={groupFilter === 'regressions' ? styles.activeTab : ''}
          onClick={() => setGroupFilter('regressions')}
        >
          Regresjoner ({comparisonData.filter(d => d.status === 'regression').length})
        </button>
        <button
          className={groupFilter === 'improvements' ? styles.activeTab : ''}
          onClick={() => setGroupFilter('improvements')}
        >
          Forbedringer ({comparisonData.filter(d => d.status === 'improvement').length})
        </button>
        <button
          className={groupFilter === 'unchanged' ? styles.activeTab : ''}
          onClick={() => setGroupFilter('unchanged')}
        >
          Uendret ({comparisonData.filter(d => d.status === 'unchanged').length})
        </button>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Side</th>
                <th>Enhet</th>
                <th>Performance</th>
                <th>SEO</th>
                <th>LCP</th>
                <th>CLS</th>
                <th>TBT</th>
                <th>Sist kjørt</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data, idx) => {
                const key = `${data.url}-${data.device}`;
                const isExpanded = expandedRows.has(key);
                
                return (
                  <React.Fragment key={key}>
                    <tr className={data.status === 'regression' ? styles.regressionRow : ''}>
                      <td>
                        <button
                          className={styles.expandButton}
                          onClick={() => toggleRow(key)}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td className={styles.urlCell}>
                        <a href={data.url} target="_blank" rel="noopener noreferrer">
                          {formatPageName(data.url)}
                        </a>
                      </td>
                      <td>
                        <span className={styles.deviceBadge}>
                          {data.device === 'mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                          {data.device === 'mobile' ? 'M' : 'D'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.scoreCell}>
                          <span className={styles.currentScore}>{data.current.performance}</span>
                          <DeltaBadge value={data.delta.performance} />
                        </div>
                      </td>
                      <td>
                        <div className={styles.scoreCell}>
                          <span className={styles.currentScore}>{data.current.seo}</span>
                          <DeltaBadge value={data.delta.seo} />
                        </div>
                      </td>
                      <td>
                        {data.current.largestContentfulPaint !== undefined && (
                          <div className={styles.scoreCell}>
                            <span className={styles.currentScore}>{Math.round(data.current.largestContentfulPaint)}ms</span>
                            {data.delta.lcp !== undefined && <DeltaBadge value={-data.delta.lcp} isMetric />}
                          </div>
                        )}
                      </td>
                      <td>
                        {data.current.cumulativeLayoutShift !== undefined && (
                          <div className={styles.scoreCell}>
                            <span className={styles.currentScore}>{data.current.cumulativeLayoutShift.toFixed(3)}</span>
                            {data.delta.cls !== undefined && <DeltaBadge value={-data.delta.cls * 1000} isMetric />}
                          </div>
                        )}
                      </td>
                      <td>
                        {data.current.totalBlockingTime !== undefined && (
                          <div className={styles.scoreCell}>
                            <span className={styles.currentScore}>{Math.round(data.current.totalBlockingTime)}ms</span>
                            {data.delta.tbt !== undefined && <DeltaBadge value={-data.delta.tbt} isMetric />}
                          </div>
                        )}
                      </td>
                      <td className={styles.dateCell}>
                        {new Date(data.current.createdAt).toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit' })}
                      </td>
                      <td>
                        <StatusBadge status={data.status} />
                      </td>
                    </tr>
                    
                    {/* Expanded row with detailed comparison */}
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td colSpan={10}>
                          <div className={styles.expandedContent}>
                            <div className={styles.comparisonGrid}>
                              <div className={styles.comparisonColumn}>
                                <h4>Nåværende ({new Date(data.current.createdAt).toLocaleDateString('nb-NO')})</h4>
                                <div className={styles.metricsList}>
                                  <MetricRow label="Performance" value={data.current.performance} />
                                  <MetricRow label="Accessibility" value={data.current.accessibility} />
                                  <MetricRow label="Best Practices" value={data.current.bestPractices} />
                                  <MetricRow label="SEO" value={data.current.seo} />
                                  {data.current.largestContentfulPaint !== undefined && (
                                    <MetricRow label="LCP" value={`${Math.round(data.current.largestContentfulPaint)}ms`} />
                                  )}
                                  {data.current.cumulativeLayoutShift !== undefined && (
                                    <MetricRow label="CLS" value={data.current.cumulativeLayoutShift.toFixed(3)} />
                                  )}
                                  {data.current.totalBlockingTime !== undefined && (
                                    <MetricRow label="TBT" value={`${Math.round(data.current.totalBlockingTime)}ms`} />
                                  )}
                                </div>
                              </div>

                              {data.previous && (
                                <>
                                  <div className={styles.comparisonColumn}>
                                    <h4>Forrige ({new Date(data.previous.createdAt).toLocaleDateString('nb-NO')})</h4>
                                    <div className={styles.metricsList}>
                                      <MetricRow label="Performance" value={data.previous.performance} />
                                      <MetricRow label="Accessibility" value={data.previous.accessibility} />
                                      <MetricRow label="Best Practices" value={data.previous.bestPractices} />
                                      <MetricRow label="SEO" value={data.previous.seo} />
                                      {data.previous.largestContentfulPaint !== undefined && (
                                        <MetricRow label="LCP" value={`${Math.round(data.previous.largestContentfulPaint)}ms`} />
                                      )}
                                      {data.previous.cumulativeLayoutShift !== undefined && (
                                        <MetricRow label="CLS" value={data.previous.cumulativeLayoutShift.toFixed(3)} />
                                      )}
                                      {data.previous.totalBlockingTime !== undefined && (
                                        <MetricRow label="TBT" value={`${Math.round(data.previous.totalBlockingTime)}ms`} />
                                      )}
                                    </div>
                                  </div>

                                  <div className={styles.comparisonColumn}>
                                    <h4>Endring (Δ)</h4>
                                    <div className={styles.metricsList}>
                                      <MetricRow label="Performance" value={<DeltaBadge value={data.delta.performance} showSign />} />
                                      <MetricRow label="Accessibility" value={<DeltaBadge value={data.delta.accessibility} showSign />} />
                                      <MetricRow label="Best Practices" value={<DeltaBadge value={data.delta.bestPractices} showSign />} />
                                      <MetricRow label="SEO" value={<DeltaBadge value={data.delta.seo} showSign />} />
                                      {data.delta.lcp !== undefined && (
                                        <MetricRow label="LCP" value={<DeltaBadge value={-data.delta.lcp} isMetric showSign />} />
                                      )}
                                      {data.delta.cls !== undefined && (
                                        <MetricRow label="CLS" value={<DeltaBadge value={-data.delta.cls * 1000} isMetric showSign />} />
                                      )}
                                      {data.delta.tbt !== undefined && (
                                        <MetricRow label="TBT" value={<DeltaBadge value={-data.delta.tbt} isMetric showSign />} />
                                      )}
                                    </div>
                                  </div>
                                </>
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
        </div>
      )}

      {filteredData.length === 0 && (
        <div className={styles.emptyState}>
          <p>Ingen data å sammenligne. Kjør minst to scans for å se endringer.</p>
        </div>
      )}
    </div>
  );
}

// Helper components
function DeltaBadge({ value, isMetric, showSign }: { value: number; isMetric?: boolean; showSign?: boolean }) {
  if (value === 0) return <span className={styles.deltaZero}>—</span>;
  
  const isPositive = value > 0;
  const absValue = Math.abs(value);
  
  return (
    <span className={`${styles.deltaBadge} ${isPositive ? styles.positive : styles.negative}`}>
      {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {showSign && (isPositive ? '+' : '-')}
      {isMetric ? absValue.toFixed(0) : absValue.toFixed(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: 'regression' | 'improvement' | 'unchanged' }) {
  const config = {
    regression: { label: 'Regresjon', icon: AlertTriangle, className: styles.statusRegression },
    improvement: { label: 'Forbedring', icon: TrendingUp, className: styles.statusImprovement },
    unchanged: { label: 'Uendret', icon: Minus, className: styles.statusUnchanged },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <span className={`${styles.statusBadge} ${className}`}>
      <Icon size={14} />
      {label}
    </span>
  );
}

function MetricRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.metricRow}>
      <span className={styles.metricLabel}>{label}:</span>
      <span className={styles.metricValue}>{value}</span>
    </div>
  );
}
