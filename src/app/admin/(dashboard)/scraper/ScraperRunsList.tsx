import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import styles from './scraper.module.css';
import { Button } from '@/components/ui/Button';

interface ScraperRunsListProps {
    onSelectRun: (id: string) => void;
}

export default function ScraperRunsList({ onSelectRun }: ScraperRunsListProps) {
    const [runs, setRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });

    const fetchRuns = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/scraper/runs?limit=20&page=${page}`, {
                cache: 'no-store'
            });
            const data = await res.json();

            if (data.runs) {
                setRuns(data.runs);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            } else if (Array.isArray(data)) {
                setRuns(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRuns(1);
    }, []);

    if (loading && runs.length === 0) return <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>Henter oversikt...</div>;

    const { page, totalPages, total } = pagination;

    return (
        <div className={styles.tableContainer}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: '#718096', fontWeight: 500 }}>
                    Totalt {total} kjøringer
                </span>
                <Button size="sm" variant="secondary" onClick={() => fetchRuns(page)} disabled={loading}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </Button>
            </div>

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
                                        run.status === 'partial' ? styles.badgeYellow :
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
                                    <span style={{ color: '#2f855a', fontWeight: 500 }} title="Suksess">{run.successCount}</span>
                                    <span style={{ color: '#e2e8f0' }}>/</span>
                                    <span style={{ color: '#b7791f', fontWeight: 500 }} title="Ingen tider">{run.emptyCount}</span>
                                    <span style={{ color: '#e2e8f0' }}>/</span>
                                    <span style={{ color: '#c53030', fontWeight: 500 }} title="Feilet">{run.failCount}</span>
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

            {runs.length === 0 && !loading && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>
                    Ingen kjøringer funnet.
                </div>
            )}

            {totalPages > 1 && (
                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchRuns(1)}
                        disabled={loading || page === 1}
                        style={{ padding: '0.3rem 0.6rem', height: '2rem' }}
                    >
                        Første
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchRuns(Math.max(1, page - 1))}
                        disabled={loading || page === 1}
                        style={{ height: '2rem' }}
                    >
                        <ChevronLeft size={16} />
                    </Button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                            .map((p, index, array) => (
                                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {index > 0 && array[index - 1] !== p - 1 && <span style={{ color: '#94a3b8' }}>...</span>}
                                    <button
                                        onClick={() => fetchRuns(p)}
                                        disabled={loading}
                                        style={{
                                            minWidth: '2rem',
                                            height: '2rem',
                                            borderRadius: '0.375rem',
                                            border: p === page ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                            background: p === page ? '#3b82f6' : 'white',
                                            color: p === page ? 'white' : '#334155',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.5 : 1
                                        }}
                                    >
                                        {p}
                                    </button>
                                </div>
                            ))
                        }
                    </div>

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchRuns(Math.min(totalPages, page + 1))}
                        disabled={loading || page === totalPages}
                        style={{ height: '2rem' }}
                    >
                        <ChevronRight size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => fetchRuns(totalPages)}
                        disabled={loading || page === totalPages}
                        style={{ padding: '0.3rem 0.6rem', height: '2rem' }}
                    >
                        Siste
                    </Button>
                </div>
            )}
        </div>
    );
}
