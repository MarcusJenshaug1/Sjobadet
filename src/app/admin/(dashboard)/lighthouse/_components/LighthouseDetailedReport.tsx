'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ExternalLink, AlertCircle, ChevronDown, ChevronUp, Info, Zap, Clock, FileWarning } from 'lucide-react';
import styles from './LighthouseDetailedReport.module.css';

interface MetricData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  score: number;
  description: string;
  unit: string;
}

interface AuditRef {
  id: string;
  weight: number;
  group: string;
}

interface AuditItem {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  displayValue?: string;
  numericValue?: number;
  details?: any;
}

interface Opportunity extends AuditItem {
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
}

interface LighthouseReport {
  id: string;
  url: string;
  device: 'mobile' | 'desktop';
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
  speedIndex?: number;
  fullReport: any;
  createdAt: string;
}

interface Props {
  url: string;
  device: 'mobile' | 'desktop';
  baseUrl: string;
  onBack: () => void;
}

export default function LighthouseDetailedReport({ url, device, baseUrl, onBack }: Props) {
  const [report, setReport] = useState<LighthouseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['metrics', 'insights']));

  useEffect(() => {
    fetchReport();
  }, [url, device]);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/lighthouse/reports');
      const data = await res.json();
      const reports = data.reports || [];
      
      console.log('Fetched reports count:', reports.length);
      console.log('Looking for URL:', url, 'Device:', device);
      
      const found = reports.find((r: LighthouseReport) => 
        r.url === url && r.device === device
      );
      
      if (found) {
        console.log('Report found:', found);
        console.log('fullReport type:', typeof found.fullReport);
        
        // Parse fullReport if it's a string
        if (typeof found.fullReport === 'string') {
          try {
            const parsed = JSON.parse(found.fullReport);
            found.fullReport = parsed;
            console.log('Parsed fullReport:', parsed);
          } catch (e) {
            console.error('Failed to parse fullReport:', e);
          }
        }
        
        setReport(found);
      } else {
        console.log('Report not found');
        if (reports.length > 0) {
          console.log('Available:', reports.slice(0, 3).map((r: LighthouseReport) => ({ url: r.url, device: r.device })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch report:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getMetricThreshold = (metricId: string, value: number): 'good' | 'average' | 'poor' => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'first-contentful-paint': { good: 1800, poor: 3000 },
      'largest-contentful-paint': { good: 2500, poor: 4000 },
      'total-blocking-time': { good: 200, poor: 600 },
      'cumulative-layout-shift': { good: 0.1, poor: 0.25 },
      'speed-index': { good: 3400, poor: 5800 },
    };

    const threshold = thresholds[metricId];
    if (!threshold) return 'average';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'average';
    return 'poor';
  };

  const formatMetricValue = (value: number, unit: string): string => {
    if (unit === 'millisecond') {
      return value >= 1000 ? `${(value / 1000).toFixed(1)} s` : `${Math.round(value)} ms`;
    }
    if (unit === 'unitless') {
      return value.toFixed(3);
    }
    return `${value}`;
  };

  const getMetrics = (): MetricData[] => {
    if (!report?.fullReport) {
      console.log('No fullReport available');
      return [];
    }

    let lhr = report.fullReport;
    
    // Parse if string
    if (typeof lhr === 'string') {
      try {
        lhr = JSON.parse(lhr);
      } catch (e) {
        console.error('Failed to parse LHR:', e);
        return [];
      }
    }

    if (!lhr.audits) {
      console.log('No audits in LHR');
      return [];
    }

    const metrics = [
      {
        id: 'first-contentful-paint',
        title: 'First Contentful Paint',
        audit: lhr.audits?.['first-contentful-paint'],
      },
      {
        id: 'total-blocking-time',
        title: 'Total Blocking Time',
        audit: lhr.audits?.['total-blocking-time'],
      },
      {
        id: 'speed-index',
        title: 'Speed Index',
        audit: lhr.audits?.['speed-index'],
      },
      {
        id: 'largest-contentful-paint',
        title: 'Largest Contentful Paint',
        audit: lhr.audits?.['largest-contentful-paint'],
      },
      {
        id: 'cumulative-layout-shift',
        title: 'Cumulative Layout Shift',
        audit: lhr.audits?.['cumulative-layout-shift'],
      },
    ];

    return metrics
      .filter(m => m.audit)
      .map(m => ({
        id: m.id,
        title: m.title,
        value: m.audit.displayValue || '—',
        numericValue: m.audit.numericValue || 0,
        score: m.audit.score !== null ? m.audit.score : 0,
        description: m.audit.description || '',
        unit: m.audit.numericUnit || 'millisecond',
      }));
  };

  const getOpportunities = (): Opportunity[] => {
    if (!report?.fullReport) return [];

    const lhr = report.fullReport;
    const perfCategory = lhr.categories?.performance;
    if (!perfCategory) return [];

    const opportunityRefs = perfCategory.auditRefs.filter(
      (ref: AuditRef) => ref.group === 'load-opportunities'
    );

    return opportunityRefs
      .map((ref: AuditRef) => {
        const audit = lhr.audits[ref.id];
        if (!audit || audit.score === null || audit.score >= 0.9) return null;

        return {
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          scoreDisplayMode: audit.scoreDisplayMode,
          displayValue: audit.displayValue,
          numericValue: audit.numericValue,
          details: audit.details,
          overallSavingsMs: audit.details?.overallSavingsMs,
          overallSavingsBytes: audit.details?.overallSavingsBytes,
        };
      })
      .filter((opp: Opportunity | null): opp is Opportunity => opp !== null)
      .sort((a: Opportunity, b: Opportunity) => (b.overallSavingsMs || 0) - (a.overallSavingsMs || 0));
  };

  const getDiagnostics = (): AuditItem[] => {
    if (!report?.fullReport) return [];

    const lhr = report.fullReport;
    const perfCategory = lhr.categories?.performance;
    if (!perfCategory) return [];

    const diagnosticRefs = perfCategory.auditRefs.filter(
      (ref: AuditRef) => ref.group === 'diagnostics'
    );

    return diagnosticRefs
      .map((ref: AuditRef) => {
        const audit = lhr.audits[ref.id];
        if (!audit) return null;

        return {
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          scoreDisplayMode: audit.scoreDisplayMode,
          displayValue: audit.displayValue,
          numericValue: audit.numericValue,
          details: audit.details,
        };
      })
      .filter((diag: AuditItem | null): diag is AuditItem => diag !== null);
  };

  const getTopInsights = (): Opportunity[] => {
    const opportunities = getOpportunities();
    return opportunities.slice(0, 5);
  };

  const categorizeDiagnostics = (diags: AuditItem[]): Record<string, AuditItem[]> => {
    const categories: Record<string, AuditItem[]> = {
      'Bilder': [],
      'JavaScript': [],
      'CSS': [],
      'Caching': [],
      'Network': [],
      'DOM': [],
      'Animasjoner': [],
      'Annet': [],
    };

    diags.forEach((diag) => {
      const title = diag.title.toLowerCase();
      const desc = diag.description?.toLowerCase() || '';
      
      if (title.includes('bilde') || title.includes('image') || desc.includes('bilde')) {
        categories['Bilder'].push(diag);
      } else if (title.includes('javascript') || title.includes('js-') || desc.includes('javascript')) {
        categories['JavaScript'].push(diag);
      } else if (title.includes('css') || desc.includes('css')) {
        categories['CSS'].push(diag);
      } else if (title.includes('cache') || title.includes('caching')) {
        categories['Caching'].push(diag);
      } else if (title.includes('network') || title.includes('request')) {
        categories['Network'].push(diag);
      } else if (title.includes('dom') || title.includes('element')) {
        categories['DOM'].push(diag);
      } else if (title.includes('animasjon') || title.includes('animation')) {
        categories['Animasjoner'].push(diag);
      } else {
        categories['Annet'].push(diag);
      }
    });

    return Object.fromEntries(
      Object.entries(categories).filter(([_, items]) => items.length > 0)
    );
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Laster rapport...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className={styles.error}>
        <AlertCircle size={48} />
        <h2>Rapport ikke funnet</h2>
        <p>Ingen rapport funnet for {url} ({device})</p>
        <button onClick={onBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Tilbake til oversikt
        </button>
      </div>
    );
  }

  const metrics = getMetrics();
  const topInsights = getTopInsights();
  const opportunities = getOpportunities();
  const diagnostics = getDiagnostics();

  console.log('Rendering detailed report');
  console.log('Metrics count:', metrics.length);
  console.log('TopInsights count:', topInsights.length);
  console.log('Opportunities count:', opportunities.length);
  console.log('Diagnostics count:', diagnostics.length);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Tilbake
        </button>
        
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{url.replace(baseUrl, '') || '/'}</h1>
          <div className={styles.meta}>
            <span className={styles.device}>{device === 'mobile' ? 'Mobil' : 'Desktop'}</span>
            <span className={styles.date}>{new Date(report.createdAt).toLocaleString('no-NO')}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
              Besøk side <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className={styles.overallScore}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreValue}>{report.performance}</span>
          </div>
          <span className={styles.scoreLabel}>Performance</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <section className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('metrics')}>
          <h2 className={styles.sectionTitle}>Core Web Vitals & Metrics</h2>
          {expandedSections.has('metrics') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expandedSections.has('metrics') && (
          <div className={styles.metricsGrid}>
            {metrics.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                <p>Ingen metrics funnet. FullReport data: {report?.fullReport ? 'tilstede' : 'mangles'}</p>
              </div>
            ) : (
              metrics.map((metric) => {
                const numVal = metric.numericValue ?? 0;
                const status = getMetricThreshold(metric.id, numVal);
                return (
                  <div key={metric.id} className={`${styles.metricCard} ${styles[`metric${status.charAt(0).toUpperCase() + status.slice(1)}`]}`}>
                    <div className={styles.metricHeader}>
                      <span className={styles.metricTitle}>{metric.title}</span>
                      <div title={metric.description}>
                        <Info size={16} className={styles.metricInfo} />
                      </div>
                    </div>
                    <div 
                      className={styles.metricValue}
                      style={{ 
                        color: status === 'good' ? '#166534' : status === 'average' ? '#92400e' : '#7f1d1d'
                      }}
                    >
                      {metric.value}
                    </div>
                    <div className={styles.metricStatus}>
                      {status === 'good' && <><TrendingUp size={14} /> God</>}
                      {status === 'average' && <><Minus size={14} /> Middels</>}
                      {status === 'poor' && <><TrendingDown size={14} /> Dårlig</>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* Top Insights */}
      {topInsights.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('insights')}>
            <h2 className={styles.sectionTitle}>
              <Zap size={20} />
              Top Insights - Prioriterte forbedringer
            </h2>
            {expandedSections.has('insights') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.has('insights') && (
            <div className={styles.insightsList}>
              {topInsights.map((insight) => (
                <div key={insight.id} className={styles.insightCard}>
                  <div className={styles.insightHeader}>
                    <h3 className={styles.insightTitle}>{insight.title}</h3>
                    {insight.overallSavingsMs && (
                      <div className={styles.savings}>
                        <Clock size={14} />
                        {insight.overallSavingsMs >= 1000 
                          ? `${(insight.overallSavingsMs / 1000).toFixed(1)} s` 
                          : `${Math.round(insight.overallSavingsMs)} ms`}
                      </div>
                    )}
                  </div>
                  <p className={styles.insightDescription}>{insight.description}</p>
                  {insight.details?.items && insight.details.items.length > 0 && (
                    <div className={styles.insightItems}>
                      <strong>{insight.details.items.length} ressurser påvirket</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('opportunities')}>
            <h2 className={styles.sectionTitle}>
              <Zap size={20} />
              Alle forbedringsmuligheter ({opportunities.length})
            </h2>
            {expandedSections.has('opportunities') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.has('opportunities') && (
            <div className={styles.opportunitiesList}>
              {opportunities.map((opp) => (
                <details key={opp.id} className={styles.opportunityCard}>
                  <summary className={styles.opportunitySummary}>
                    <div className={styles.opportunityInfo}>
                      <h3>{opp.title}</h3>
                      {opp.overallSavingsMs && (
                        <span className={styles.savings}>
                          Spar: {opp.overallSavingsMs >= 1000 
                            ? `${(opp.overallSavingsMs / 1000).toFixed(1)} s` 
                            : `${Math.round(opp.overallSavingsMs)} ms`}
                        </span>
                      )}
                    </div>
                    <ChevronDown size={20} />
                  </summary>
                  <div className={styles.opportunityDetails}>
                    <p>{opp.description}</p>
                    {opp.details?.items && (
                      <div className={styles.resourceList}>
                        <strong>Berørte ressurser ({opp.details.items.length}):</strong>
                        <ul>
                          {opp.details.items.slice(0, 10).map((item: any, idx: number) => (
                            <li key={idx}>
                              {item.url || item.source || item.node?.snippet || JSON.stringify(item).slice(0, 100)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Diagnostics */}
      {diagnostics.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('diagnostics')}>
            <h2 className={styles.sectionTitle}>
              <FileWarning size={20} />
              Diagnostikk & Tekniske detaljer ({diagnostics.length})
            </h2>
            {expandedSections.has('diagnostics') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {expandedSections.has('diagnostics') && (
            <div className={styles.diagnosticsContainer}>
              {Object.entries(categorizeDiagnostics(diagnostics)).map(([category, items]) => (
                <div key={category} className={styles.diagnosticCategory}>
                  <h3 className={styles.categoryTitle}>
                    {category}
                    <span className={styles.categoryCount}>{items.length}</span>
                  </h3>
                  <div className={styles.diagnosticGrid}>
                    {items.map((diag) => (
                      <details key={diag.id} className={styles.diagnosticItem}>
                        <summary className={styles.diagnosticItemSummary}>
                          <div className={styles.diagnosticItemTitle}>
                            <span>{diag.title}</span>
                            {diag.displayValue && (
                              <span className={styles.diagnosticItemValue}>{diag.displayValue}</span>
                            )}
                          </div>
                          <ChevronDown size={16} className={styles.expandIcon} />
                        </summary>
                        <div className={styles.diagnosticItemContent}>
                          <p className={styles.diagnosticItemDescription}>{diag.description}</p>
                          {diag.details && (
                            <div className={styles.diagnosticItemDetails}>
                              {typeof diag.details === 'object' && !Array.isArray(diag.details) ? (
                                <pre style={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '300px' }}>
                                  {JSON.stringify(diag.details, null, 2).slice(0, 500)}
                                </pre>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
