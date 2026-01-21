'use client';

import { useState } from 'react';
import styles from './scraper.module.css';
import ScraperOverview from './ScraperOverview';
import ScraperRunsList from './ScraperRunsList';
import ScraperLiveLogs from './ScraperLiveLogs';

export default function ScraperPage() {
    const [activeTab, setActiveTab] = useState<'overview' | 'runs' | 'live' | 'saunas'>('overview');
    const [activeRunId, setActiveRunId] = useState<string | null>(null);

    const handleRunSelect = (runId: string) => {
        setActiveRunId(runId);
        setActiveTab('live');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Scraper Status</h1>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Oversikt
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'runs' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('runs')}
                >
                    Historikk
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'live' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('live')}
                >
                    Live Logs {activeRunId && <span className={`${styles.badge} ${styles.badgeBlue}`}>Active</span>}
                </button>
            </div>

            <div className={styles.section}>
                {activeTab === 'overview' && (
                    <ScraperOverview onRequestRunLogs={handleRunSelect} />
                )}
                {activeTab === 'runs' && (
                    <ScraperRunsList onSelectRun={handleRunSelect} />
                )}
                {activeTab === 'live' && (
                    <ScraperLiveLogs runId={activeRunId} />
                )}
            </div>
        </div>
    );
}
