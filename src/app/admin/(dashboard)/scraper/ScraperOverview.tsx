'use client';

import { useState, useEffect } from 'react';
import { Play, RotateCw, AlertTriangle, XCircle, Check, X } from 'lucide-react';
import styles from './scraper.module.css';

export default function ScraperOverview({ onRequestRunLogs }: { onRequestRunLogs: (id: string) => void }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/scraper/runs?limit=1', {
                cache: 'no-store'
            });
            const data = await res.json();
            if (data.runs && data.runs.length > 0) {
                setStats(data.runs[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleTrigger = async (mode: 'all' | 'selected') => {
        if (!confirm('Start scraper run?')) return;
        setRunning(true);
        try {
            const res = await fetch('/api/admin/scraper/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server error ${res.status}: ${text}`);
            }

            const data = await res.json();
            if (data.success) {
                alert('Scraper run started successfully!');
                onRequestRunLogs(data.runId);
            } else {
                alert('Start failed: ' + data.error);
            }
        } catch (e: any) {
            console.error(e);
            alert(`Error triggering run: ${e.message}`);
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Card */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <h2 className={styles.cardTitle}>System Status</h2>
                        <p style={{ color: '#718096', fontSize: '0.875rem' }}>Last Run</p>
                        {stats ? (
                            <div style={{ marginTop: '0.25rem' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>
                                    {new Date(stats.finishedAt || stats.startedAt).toLocaleString('nb-NO')}
                                </div>
                                <div className={`${styles.badge} ${stats.status === 'success' ? styles.badgeGreen :
                                    stats.status === 'failed' ? styles.badgeRed :
                                        styles.badgeBlue
                                    }`} style={{ marginTop: '0.25rem' }}>
                                    {stats.status.toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>No runs recorded</p>
                        )}
                    </div>

                    <button
                        onClick={() => handleTrigger('all')}
                        disabled={running}
                        className={styles.button}
                    >
                        {running ? <RotateCw className="animate-spin" size={16} /> : <Play size={16} />}
                        Run Full Scrape
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.statSuccess}`}>
                    <div className={styles.statLabel}>
                        <Check size={18} />
                        <span>Success</span>
                    </div>
                    <div className={styles.statValue}>
                        {stats?.successCount ?? 0}
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.statWarning}`}>
                    <div className={styles.statLabel}>
                        <AlertTriangle size={18} />
                        <span>Empty/Warning</span>
                    </div>
                    <div className={styles.statValue}>
                        {stats?.emptyCount ?? 0}
                    </div>
                </div>

                <div className={`${styles.statCard} ${styles.statError}`}>
                    <div className={styles.statLabel}>
                        <X size={18} />
                        <span>Failed</span>
                    </div>
                    <div className={styles.statValue}>
                        {stats?.failCount ?? 0}
                    </div>
                </div>
            </div>
        </div>
    );
}
