'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './scraper.module.css';

interface ScraperRunsListProps {
    onSelectRun: (id: string) => void;
}

export default function ScraperRunsList({ onSelectRun }: ScraperRunsListProps) {
    const [runs, setRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRuns = async () => {
            try {
                const res = await fetch('/api/admin/scraper/runs?limit=50');
                const data = await res.json();
                console.log('Fetched runs:', data); // Debug log
                if (data.runs) {
                    setRuns(data.runs);
                } else if (Array.isArray(data)) {
                    setRuns(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchRuns();
    }, []);

    if (loading) return <div style={{ padding: '1rem', color: '#718096' }}>Loading runs...</div>;

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Started</th>
                        <th>Duration</th>
                        <th>Trigger</th>
                        <th>Stats</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {runs.map((run) => (
                        <tr key={run.id}>
                            <td>
                                <span className={`${styles.badge} ${run.status === 'success' ? styles.badgeGreen :
                                    run.status === 'failed' ? styles.badgeRed :
                                        run.status === 'running' ? styles.badgeBlue :
                                            styles.badgeGray
                                    }`}>
                                    {run.status.toUpperCase()}
                                </span>
                            </td>
                            <td style={{ fontSize: '0.875rem', color: '#718096' }}>
                                {new Date(run.startedAt).toLocaleString('nb-NO')}
                            </td>
                            <td style={{ fontSize: '0.875rem', color: '#718096' }}>
                                {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : '-'}
                            </td>
                            <td style={{ fontSize: '0.875rem', color: '#718096' }}>
                                {run.trigger}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#2f855a', fontWeight: 500 }} title="Success">{run.successCount}</span>
                                    <span style={{ color: '#e2e8f0' }}>/</span>
                                    <span style={{ color: '#b7791f', fontWeight: 500 }} title="Empty">{run.emptyCount}</span>
                                    <span style={{ color: '#e2e8f0' }}>/</span>
                                    <span style={{ color: '#c53030', fontWeight: 500 }} title="Failed">{run.failCount}</span>
                                </div>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <button
                                    onClick={() => onSelectRun(run.id)}
                                    className={styles.linkButton}
                                    style={{ justifyContent: 'flex-end', width: '100%' }}
                                >
                                    Logg <ChevronRight size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {runs.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
                    No runs found.
                </div>
            )}
        </div>
    );
}
