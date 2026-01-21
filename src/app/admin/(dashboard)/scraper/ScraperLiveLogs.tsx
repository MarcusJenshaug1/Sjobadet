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

    const logsEndRef = useRef<HTMLDivElement>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    // Fetch initial details and past logs if runId changes
    useEffect(() => {
        if (!runId) return;

        setLogs([]);
        setStatus('connecting');

        // 1. Fetch run details + existing logs
        const fetchInitial = async () => {
            try {
                const res = await fetch(`/api/admin/scraper/runs/${runId}`);
                if (!res.ok) throw new Error('Failed to fetch run');
                const data = await res.json();

                if (data.run.events) {
                    // Sort logs if needed
                    const pastLogs = data.run.events.map((e: any) => ({
                        id: e.id,
                        message: e.message,
                        level: e.level,
                        timestamp: e.createdAt,
                        scope: e.scope,
                        data: e.dataJson ? JSON.parse(e.dataJson) : null
                    })).sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                    setLogs(pastLogs);
                }

                if (['success', 'failed', 'cancelled', 'partial'].includes(data.run.status)) {
                    setStatus('completed');
                    return; // Don't stream if finished
                }

                // If running, start SSE
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
    }, [logs]);

    const startStream = (id: string) => {
        if (eventSourceRef.current) eventSourceRef.current.close();

        const es = new EventSource(`/api/admin/scraper/stream?runId=${id}`);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload.type === 'log' && payload.data) {
                    const newLog = {
                        id: payload.data.id,
                        message: payload.data.message,
                        level: payload.data.level,
                        timestamp: payload.data.createdAt,
                        scope: payload.data.scope,
                        data: payload.data.dataJson ? JSON.parse(payload.data.dataJson) : null
                    };
                    setLogs(prev => [...prev, newLog]);
                } else if (payload.type === 'status') {
                    // update status
                } else if (payload.type === 'done') {
                    setStatus('completed');
                    es.close();
                }
            } catch (e) {
                console.error('Parse error', e);
            }
        };

        es.onerror = (e) => {
            console.error('SSE Error', e);
            es.close();
        };

        setStatus('streaming');
    };

    if (!runId) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#a0aec0', background: '#f7fafc', border: '1px solid #edf2f7', borderRadius: '0.5rem' }}>
                <Terminal size={48} style={{ marginBottom: '1rem', color: '#cbd5e0' }} />
                <p>Select a run to view logs</p>
            </div>
        );
    }

    return (
        <div className={styles.terminal}>
            {/* Header */}
            <div className={styles.terminalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`${styles.statusIndicator} ${status === 'streaming' ? styles.statusActive : styles.statusDone}`} />
                    <span style={{ fontWeight: 600, color: 'white' }}>Live Logs: {runId}</span>
                </div>
                {status === 'completed' && <span style={{ fontSize: '0.75rem', background: '#4a5568', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Finished</span>}
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
                <div ref={logsEndRef} />
            </div>
        </div>
    );
}
