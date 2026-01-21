'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import styles from './scraper.module.css';

interface ScraperLiveLogsProps {
    runId: string | null;
}

export default function ScraperLiveLogs({ runId }: ScraperLiveLogsProps) {
    const [logs, setLogs] = useState<any[]>([]);
    const [status, setStatus] = useState<string>('idle'); // idle, connecting, streaming, completed, error
    const [currentSauna, setCurrentSauna] = useState<string | null>(null);
    const seenIds = useRef<Set<string>>(new Set());

    const logsEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    // Reset deduplication when runId changes
    useEffect(() => {
        seenIds.current.clear();
        setCurrentSauna(null);
    }, [runId]);

    // Fetch initial details and past logs if runId changes
    useEffect(() => {
        if (!runId) return;

        setLogs([]);
        setStatus('connecting');

        const fetchInitial = async () => {
            try {
                const res = await fetch(`/api/admin/scraper/runs/${runId}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch run');
                const data = await res.json();

                if (data.run.events) {
                    const pastLogs = data.run.events.map((e: any) => {
                        seenIds.current.add(e.id);
                        return {
                            id: e.id,
                            message: e.message,
                            level: e.level,
                            timestamp: e.createdAt,
                            scope: e.scope,
                            data: e.dataJson ? JSON.parse(e.dataJson) : null
                        };
                    }).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                    setLogs(pastLogs);

                    // Try to guess current sauna from last log if still running
                    if (data.run.status === 'running') {
                        const startMsg = [...pastLogs].reverse().find(l => l.message.includes('Starting scrape for'));
                        if (startMsg) {
                            const match = startMsg.message.match(/Starting scrape for (.*)/);
                            if (match) setCurrentSauna(match[1]);
                        }
                    }
                }

                if (['success', 'failed', 'cancelled', 'partial'].includes(data.run.status)) {
                    setStatus('completed');
                    return;
                }

                startStream(runId);
            } catch (e) {
                console.error(e);
                setStatus('error');
            }
        };

        fetchInitial();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [runId]);

    // Auto-scroll
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs, currentSauna]);

    const startStream = (id: string) => {
        if (eventSourceRef.current) eventSourceRef.current.close();

        const es = new EventSource(`/api/admin/scraper/stream?runId=${id}`);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === 'log' && payload.data) {
                    // Deduplicate
                    if (seenIds.current.has(payload.data.id)) return;
                    seenIds.current.add(payload.data.id);

                    const newLog = {
                        id: payload.data.id,
                        message: payload.data.message,
                        level: payload.data.level,
                        timestamp: payload.data.createdAt,
                        scope: payload.data.scope,
                        data: payload.data.dataJson ? JSON.parse(payload.data.dataJson) : null
                    };

                    // Detect current sauna
                    if (newLog.message.includes('Starting scrape for')) {
                        const match = newLog.message.match(/Starting scrape for (.*)/);
                        if (match) setCurrentSauna(match[1]);
                    } else if (newLog.message.includes('Ferdig med') || newLog.message.includes('Ingen tider funnet')) {
                        // Keep current until next one starts or it finishes globally
                    }

                    setLogs(prev => [...prev, newLog]);
                } else if (payload.type === 'status') {
                    if (['success', 'failed', 'partial', 'cancelled'].includes(payload.status)) {
                        setStatus('completed');
                        setCurrentSauna(null);
                    }
                } else if (payload.type === 'done') {
                    setStatus('completed');
                    setCurrentSauna(null);
                    es.close();
                }
            } catch (e) {
                console.error('Parse error', e);
            }
        };

        es.onerror = (e) => {
            console.error('SSE Error', e);
            es.close();
            // Optional: retry logic
        };

        setStatus('streaming');
    };

    if (!runId) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#a0aec0', background: '#f7fafc', border: '1px solid #edf2f7', borderRadius: '0.5rem' }}>
                <Terminal size={48} style={{ marginBottom: '1rem', color: '#cbd5e0' }} />
                <p>Velg en kjøring for å se live logger</p>
            </div>
        );
    }

    return (
        <div className={styles.terminal}>
            {/* Header */}
            <div className={styles.terminalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`${styles.statusIndicator} ${status === 'streaming' ? styles.statusActive : styles.statusDone} ${status === 'streaming' ? styles.pulse : ''}`} />
                    <span style={{ fontWeight: 600, color: 'white' }}>Live Logs: {runId}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {status === 'streaming' && (
                        <div style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <div className={styles.spinner} /> Koblet til
                        </div>
                    )}
                    {status === 'completed' && <span style={{ fontSize: '0.75rem', background: '#4a5568', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Ferdig</span>}
                </div>
            </div>

            {/* Terminal Output */}
            <div className={styles.terminalBody}>
                {logs.map((log, i) => (
                    <div key={log.id || i} className={styles.logEntry}>
                        <span className={styles.logTimestamp}>
                            [{new Date(log.timestamp).toLocaleTimeString()}]
                        </span>

                        <span className={`${styles.logLevel} ${styles[`level${log.level.toUpperCase()}`] || ''}`}>
                            {log.level}
                        </span>

                        <span className={styles.logScope}>
                            {log.scope}
                        </span>

                        <div className={styles.logMessage}>
                            {log.message}
                            {log.data && (
                                <pre style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#a0aec0', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.25rem', overflowX: 'auto' }}>
                                    {JSON.stringify(log.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    </div>
                ))}

                {status === 'streaming' && currentSauna && (
                    <div className={styles.terminalProgress}>
                        <div className={styles.spinner} />
                        <span>Jobber med: <strong>{currentSauna}</strong>...</span>
                    </div>
                )}

                <div ref={logsEndRef} />
            </div>
        </div>
    );
}
