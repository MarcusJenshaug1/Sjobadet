'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, Users, CheckCircle, XCircle, Activity, Calendar, Download, Filter, Eye, EyeOff, MinusCircle } from 'lucide-react';
import { PageWrapper } from '@/components/admin/PageWrapper';
import styles from './Privacy.module.css';

interface PrivacyStats {
    overview: {
        totalConsents: number;
        consents7d: number;
        consents30d: number;
        consentRate7d: number;
        consentRate30d: number;
        activeSessions: number;
        latestPolicyVersion: string;
    };
    consentBreakdown: {
        byChoice: Array<{ choice: string; count: number }>;
        analysis: {
            accepted7d: number;
            declined7d: number;
            accepted30d: number;
            declined30d: number;
            ignored30d: number;
        };
    };
}

interface ConsentLog {
    id: string;
    timestamp: string;
    consentVersion: string;
    choice: string;
    essential: boolean;
    analysis: boolean;
    functional: boolean;
    marketing: boolean;
    source: string | null;
    sessionId: string | null;
}

interface PrivacySession {
    id: string;
    firstSeen: string;
    lastSeen: string;
    hasConsent: boolean;
    ipAddress: string | null;
    deviceType: string | null;
    browser: string | null;
    os: string | null;
    referrer: string | null;
    utmSource: string | null;
    pageviewCount: number;
    eventCount: number;
}

export default function PrivacyPage() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab') as 'overview' | 'consents' | 'sessions' | 'docs' | null;
    
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<PrivacyStats | null>(null);
    const [consentLogs, setConsentLogs] = useState<ConsentLog[]>([]);
    const [sessions, setSessions] = useState<PrivacySession[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'consents' | 'sessions' | 'docs'>(tabParam || 'overview');
    const [maskIp, setMaskIp] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalSessions, setTotalSessions] = useState(0);
    const [totalConsents, setTotalConsents] = useState(0);
    const pageSize = 50;

    // Filters
    const [consentFilter, setConsentFilter] = useState<'all' | 'accepted' | 'declined' | 'custom'>('all');
    const [analysisFilter, setAnalysisFilter] = useState<'all' | 'true' | 'false'>('all');
    const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('30d');
    const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile'>('all');
    const [browserFilter, setBrowserFilter] = useState<'all' | 'Chrome' | 'Firefox' | 'Safari'>('all');

    // Expandable session
    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
    const [sessionPageviews, setSessionPageviews] = useState<{ [key: string]: Array<{ path: string; timestamp: string }> }>({});

    // Update active tab when URL changes
    useEffect(() => {
        if (tabParam && ['overview', 'consents', 'sessions', 'docs'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    useEffect(() => {
        loadData();
    }, [consentFilter, analysisFilter, dateRange, maskIp, currentPage, deviceFilter, browserFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch stats - add timestamp to bypass cache
            const statsRes = await fetch(`/api/privacy/stats?t=${Date.now()}`);
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            } else {
                console.error('Failed to load stats:', await statsRes.text());
            }

            // Build query params for consent logs
            const consentParams = new URLSearchParams();
            if (consentFilter !== 'all') consentParams.set('choice', consentFilter);
            if (analysisFilter !== 'all') consentParams.set('analysis', analysisFilter);
            if (dateRange !== 'all') {
                const now = new Date();
                const daysAgo = dateRange === '7d' ? 7 : 30;
                const from = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
                consentParams.set('from', from.toISOString());
            }
            consentParams.set('limit', String(pageSize));
            consentParams.set('offset', String((currentPage - 1) * pageSize));

            const consentRes = await fetch(`/api/privacy/consent-logs?${consentParams}`);
            const consentData = await consentRes.json();
            setConsentLogs(consentData.logs || []);
            setTotalConsents(consentData.total || 0);

            // Fetch sessions with filters
            const sessionParams = new URLSearchParams();
            sessionParams.set('limit', String(pageSize));
            sessionParams.set('offset', String((currentPage - 1) * pageSize));
            sessionParams.set('maskIp', maskIp.toString());
            if (dateRange !== 'all') {
                const now = new Date();
                const daysAgo = dateRange === '7d' ? 7 : 30;
                const from = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
                sessionParams.set('from', from.toISOString());
            }
            if (deviceFilter !== 'all') sessionParams.set('deviceType', deviceFilter);
            if (browserFilter !== 'all') sessionParams.set('browser', browserFilter);

            const sessionRes = await fetch(`/api/privacy/sessions?${sessionParams}`);
            const sessionData = await sessionRes.json();
            setSessions(sessionData.sessions || []);
            setTotalSessions(sessionData.total || 0);
        } catch (error) {
            console.error('Failed to load privacy data:', error);
        }
        setLoading(false);
    };

    const toggleSessionDetails = async (sessionId: string) => {
        if (expandedSessionId === sessionId) {
            setExpandedSessionId(null);
            return;
        }

        setExpandedSessionId(sessionId);

        // Load pageviews if not already loaded
        if (!sessionPageviews[sessionId]) {
            try {
                const res = await fetch(`/api/privacy/session-pageviews?sessionId=${sessionId}`);
                const data = await res.json();
                setSessionPageviews(prev => ({
                    ...prev,
                    [sessionId]: data.pageviews || []
                }));
            } catch (error) {
                console.error('Failed to load pageviews:', error);
            }
        }
    };

    if (loading && !stats) {
        return (
            <PageWrapper title="Personvern & Samtykke">
                <div className={styles.loading}>Laster...</div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper title="Personvern & Samtykke">
            <div className={styles.container}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    <button 
                        className={activeTab === 'overview' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('overview')}
                    >
                        <Activity size={16} /> Oversikt
                    </button>
                    <button 
                        className={activeTab === 'consents' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('consents')}
                    >
                        <CheckCircle size={16} /> Samtykkelogg
                    </button>
                    <button 
                        className={activeTab === 'sessions' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('sessions')}
                    >
                        <Users size={16} /> Sessions
                    </button>
                    <button 
                        className={activeTab === 'docs' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('docs')}
                    >
                        <Shield size={16} /> Dokumentasjon
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className={styles.overview}>
                        {!stats ? (
                            <div className={styles.emptyState}>
                                <Activity size={48} />
                                <h3>Laster statistikk...</h3>
                                <p>Hvis dette tar lang tid, kjør <code>npx prisma generate</code></p>
                            </div>
                        ) : (
                            <>
                        <div className={styles.kpiGrid}>
                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <CheckCircle size={24} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <div className={styles.kpiValue}>{stats.overview.consentRate7d}%</div>
                                    <div className={styles.kpiLabel}>Samtykke-rate (7d)</div>
                                    <div className={styles.kpiMeta}>
                                        {stats.overview.consents7d} totalt siste 7 dager
                                    </div>
                                </div>
                            </div>

                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <Calendar size={24} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <div className={styles.kpiValue}>{stats.overview.consentRate30d}%</div>
                                    <div className={styles.kpiLabel}>Samtykke-rate (30d)</div>
                                    <div className={styles.kpiMeta}>
                                        {stats.overview.consents30d} totalt siste 30 dager
                                    </div>
                                </div>
                            </div>

                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <Users size={24} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <div className={styles.kpiValue}>{stats.overview.activeSessions}</div>
                                    <div className={styles.kpiLabel}>Aktive sessions</div>
                                    <div className={styles.kpiMeta}>
                                        Kun sessions med samtykke
                                    </div>
                                </div>
                            </div>

                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <Shield size={24} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <div className={styles.kpiValue}>{stats.overview.latestPolicyVersion}</div>
                                    <div className={styles.kpiLabel}>Policy-versjon</div>
                                    <div className={styles.kpiMeta}>
                                        Siste aktive versjon
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.breakdownGrid}>
                            <div className={styles.breakdownCard}>
                                <h3>Samtykkevalg</h3>
                                <div className={styles.breakdownList}>
                                    {stats.consentBreakdown.byChoice.map(item => (
                                        <div key={item.choice} className={styles.breakdownItem}>
                                            <span className={styles.breakdownLabel}>
                                                {item.choice === 'accepted' && 'Godta alle'}
                                                {item.choice === 'declined' && 'Avslå'}
                                                {item.choice === 'custom' && 'Tilpasset'}
                                            </span>
                                            <span className={styles.breakdownValue}>{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.breakdownCard}>
                                <h3>Analyse-samtykke (siste 30 dager)</h3>
                                <div className={styles.breakdownList}>
                                    <div className={styles.breakdownItem}>
                                        <span className={styles.breakdownLabel}>
                                            <CheckCircle size={16} color="#10b981" /> Godkjent
                                        </span>
                                        <span className={styles.breakdownValue}>
                                            {stats.consentBreakdown.analysis.accepted30d}
                                        </span>
                                    </div>
                                    <div className={styles.breakdownItem}>
                                        <span className={styles.breakdownLabel}>
                                            <XCircle size={16} color="#ef4444" /> Avslått
                                        </span>
                                        <span className={styles.breakdownValue}>
                                            {stats.consentBreakdown.analysis.declined30d}
                                        </span>
                                    </div>
                                    <div className={styles.breakdownItem}>
                                        <span className={styles.breakdownLabel}>
                                            <MinusCircle size={16} color="#6b7280" /> Ignorert
                                        </span>
                                        <span className={styles.breakdownValue}>
                                            {stats.consentBreakdown.analysis.ignored30d}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoBox}>
                            <Shield size={20} />
                            <div>
                                <strong>GDPR-compliance:</strong> Ingen persondata samles før brukeren aktivt godtar "Analyse"-kategorien. 
                                Admin-brukere spores aldri. All tracking er anonym og basert på session-ID.
                            </div>
                        </div>
                        </>
                        )}
                    </div>
                )}

                {/* Consent Logs Tab */}
                {activeTab === 'consents' && (
                    <div className={styles.tableSection}>
                        <div className={styles.filterBar}>
                            <div className={styles.filterGroup}>
                                <label>Valg:</label>
                                <select value={consentFilter} onChange={e => setConsentFilter(e.target.value as any)}>
                                    <option value="all">Alle</option>
                                    <option value="accepted">Godta alle</option>
                                    <option value="declined">Avslå</option>
                                    <option value="custom">Tilpasset</option>
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <label>Analyse:</label>
                                <select value={analysisFilter} onChange={e => setAnalysisFilter(e.target.value as any)}>
                                    <option value="all">Alle</option>
                                    <option value="true">Godkjent</option>
                                    <option value="false">Avslått</option>
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <label>Periode:</label>
                                <select value={dateRange} onChange={e => setDateRange(e.target.value as any)}>
                                    <option value="7d">Siste 7 dager</option>
                                    <option value="30d">Siste 30 dager</option>
                                    <option value="all">Alle</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Tidspunkt</th>
                                        <th>Versjon</th>
                                        <th>Valg</th>
                                        <th>Analyse</th>
                                        <th>Funksjonelt</th>
                                        <th>Markedsføring</th>
                                        <th>Kilde</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {consentLogs.map(log => (
                                        <tr key={log.id}>
                                            <td>{new Date(log.timestamp).toLocaleString('no-NO')}</td>
                                            <td><code>{log.consentVersion}</code></td>
                                            <td>
                                                <span className={`${styles.badge} ${styles[`badge${log.choice}`]}`}>
                                                    {log.choice === 'accepted' && 'Godta alle'}
                                                    {log.choice === 'declined' && 'Avslå'}
                                                    {log.choice === 'custom' && 'Tilpasset'}
                                                </span>
                                            </td>
                                            <td>{log.analysis ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}</td>
                                            <td>{log.functional ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}</td>
                                            <td>{log.marketing ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />}</td>
                                            <td>{log.source || 'ukjent'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {consentLogs.length === 0 && (
                                <div className={styles.emptyState}>Ingen samtykkelogger funnet</div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalConsents > pageSize && (
                            <div className={styles.pagination}>
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className={styles.paginationButton}
                                >
                                    Forrige
                                </button>
                                <span className={styles.paginationInfo}>
                                    Side {currentPage} av {Math.ceil(totalConsents / pageSize)} 
                                    <span className={styles.totalCount}>({totalConsents} totalt)</span>
                                </span>
                                <button 
                                    disabled={currentPage >= Math.ceil(totalConsents / pageSize)}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className={styles.paginationButton}
                                >
                                    Neste
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Sessions Tab */}
                {activeTab === 'sessions' && (
                    <div className={styles.tableSection}>
                        <div className={styles.filterBar}>
                            <div className={styles.filterGroup}>
                                <label>Periode:</label>
                                <select value={dateRange} onChange={e => { setDateRange(e.target.value as any); setCurrentPage(1); }}>
                                    <option value="7d">Siste 7 dager</option>
                                    <option value="30d">Siste 30 dager</option>
                                    <option value="all">Alle</option>
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <label>Enhet:</label>
                                <select value={deviceFilter} onChange={e => { setDeviceFilter(e.target.value as any); setCurrentPage(1); }}>
                                    <option value="all">Alle</option>
                                    <option value="desktop">Desktop</option>
                                    <option value="mobile">Mobile</option>
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <label>Nettleser:</label>
                                <select value={browserFilter} onChange={e => { setBrowserFilter(e.target.value as any); setCurrentPage(1); }}>
                                    <option value="all">Alle</option>
                                    <option value="Chrome">Chrome</option>
                                    <option value="Firefox">Firefox</option>
                                    <option value="Safari">Safari</option>
                                </select>
                            </div>
                            <button 
                                className={styles.toggleButton}
                                onClick={() => setMaskIp(!maskIp)}
                            >
                                {maskIp ? <Eye size={16} /> : <EyeOff size={16} />}
                                {maskIp ? 'Vis full IP' : 'Masker IP'}
                            </button>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Session ID</th>
                                        <th>Første besøk</th>
                                        <th>Siste aktivitet</th>
                                        <th>IP-adresse</th>
                                        <th>Enhet</th>
                                        <th>Nettleser</th>
                                        <th>Kilde</th>
                                        <th>Sider</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map(session => (
                                        <>
                                            <tr key={session.id} onClick={() => toggleSessionDetails(session.id)} className={styles.clickableRow}>
                                                <td><code className={styles.sessionId}>{session.id.substring(0, 12)}...</code></td>
                                                <td>{new Date(session.firstSeen).toLocaleDateString('no-NO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                                <td>{new Date(session.lastSeen).toLocaleDateString('no-NO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                                <td><code>{session.ipAddress || 'N/A'}</code></td>
                                                <td>{session.deviceType || 'N/A'}</td>
                                                <td>{session.browser || 'N/A'}</td>
                                                <td title={session.referrer || undefined}>
                                                    {session.utmSource ? `${session.utmSource}${session.utmMedium ? '/' + session.utmMedium : ''}` : session.referrer ? new URL(session.referrer).hostname : 'Direkte'}
                                                </td>
                                                <td>{session.pageviewCount}</td>
                                                <td>
                                                    <button className={styles.expandButton}>
                                                        {expandedSessionId === session.id ? '▼' : '▶'}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedSessionId === session.id && (
                                                <tr className={styles.expandedRow}>
                                                    <td colSpan={9}>
                                                        <div className={styles.pageviewsList}>
                                                            <h4>Besøkte sider ({sessionPageviews[session.id]?.length || 0}):</h4>
                                                            {sessionPageviews[session.id] ? (
                                                                <div className={styles.pageviews}>
                                                                    {sessionPageviews[session.id].map((pv, idx) => (
                                                                        <div key={idx} className={styles.pageview}>
                                                                            <span className={styles.path}>{pv.path}</span>
                                                                            <span className={styles.time}>{new Date(pv.timestamp).toLocaleTimeString('no-NO')}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className={styles.loading}>Laster...</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                            {sessions.length === 0 && (
                                <div className={styles.emptyState}>Ingen sessions funnet</div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalSessions > pageSize && (
                            <div className={styles.pagination}>
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className={styles.paginationButton}
                                >
                                    Forrige
                                </button>
                                <span className={styles.paginationInfo}>
                                    Side {currentPage} av {Math.ceil(totalSessions / pageSize)} 
                                    <span className={styles.totalCount}>({totalSessions} totalt)</span>
                                </span>
                                <button 
                                    disabled={currentPage >= Math.ceil(totalSessions / pageSize)}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className={styles.paginationButton}
                                >
                                    Neste
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Documentation Tab */}
                {activeTab === 'docs' && (
                    <div className={styles.docs}>
                        <section className={styles.docSection}>
                            <h2>Cookie-kategorier</h2>
                            <div className={styles.docTable}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Kategori</th>
                                            <th>Cookie-navn</th>
                                            <th>Formål</th>
                                            <th>Varighet</th>
                                            <th>Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Nødvendig</strong></td>
                                            <td><code>sjobadet_consent</code></td>
                                            <td>Lagrer brukerens personvernvalg</td>
                                            <td>1 år</td>
                                            <td>First-party</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Analyse</strong></td>
                                            <td><code>sjobadet_session</code></td>
                                            <td>Anonym sporing av brukeratferd (kun med samtykke)</td>
                                            <td>24 timer</td>
                                            <td>First-party</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className={styles.docSection}>
                            <h2>Samtykkelogikk</h2>
                            <div className={styles.docContent}>
                                <h3>Standard oppførsel (ingen samtykke):</h3>
                                <ul>
                                    <li>Ingen analyse-tracking</li>
                                    <li>Ingen session cookies</li>
                                    <li>Kun nødvendig consent-cookie</li>
                                </ul>

                                <h3>Krav for tracking:</h3>
                                <ul>
                                    <li>Brukeren må aktivt godta "Analyse"-kategorien</li>
                                    <li>Admin-brukere spores aldri (flagg: SJOBADET_IS_ADMIN)</li>
                                    <li>Session-data inkluderer: ID, UTM, referrer, enhet, IP (hashet)</li>
                                </ul>

                                <h3>Samtykkevalg:</h3>
                                <ol>
                                    <li><strong>Godta alle:</strong> Alle kategorier aktiveres</li>
                                    <li><strong>Avslå:</strong> Kun nødvendige cookies</li>
                                    <li><strong>Tilpass:</strong> Brukeren velger enkeltvis</li>
                                </ol>
                            </div>
                        </section>

                        <section className={styles.docSection}>
                            <h2>Persondata-håndtering</h2>
                            <div className={styles.docContent}>
                                <h3>Data som samles (kun med samtykke):</h3>
                                <ul>
                                    <li><strong>Session-ID:</strong> Anonym nanoid-generert identifier</li>
                                    <li><strong>IP-adresse:</strong> Hashet med SHA-256, full IP kun synlig for admin</li>
                                    <li><strong>User-Agent:</strong> Normalisert til enhet/nettleser (ikke full streng)</li>
                                    <li><strong>UTM & Referrer:</strong> Kampanjesporing og trafikkilde</li>
                                </ul>

                                <h3>Data som IKKE samles:</h3>
                                <ul>
                                    <li>Navn, e-post eller annen PII</li>
                                    <li>Booking-data (håndteres separat av booking-system)</li>
                                    <li>Admin-aktivitet (ekskludert fra tracking)</li>
                                </ul>

                                <h3>Retention policy:</h3>
                                <p>Sessions og samtykkelogger beholdes inntil videre. Fremtidig implementasjon: Auto-sletting etter 90 dager.</p>
                            </div>
                        </section>

                        <section className={styles.docSection}>
                            <h2>GDPR-compliance</h2>
                            <div className={styles.docContent}>
                                <h3>Brukerrettigheter:</h3>
                                <ul>
                                    <li><strong>Innsyn:</strong> Brukere kan se og endre samtykke via "Personvernvalg" i footer</li>
                                    <li><strong>Sletting:</strong> Planlagt funksjon (ikke implementert)</li>
                                    <li><strong>Eksport:</strong> Planlagt funksjon (ikke implementert)</li>
                                </ul>

                                <h3>Juridisk grunnlag:</h3>
                                <ul>
                                    <li><strong>Nødvendige cookies:</strong> Legitim interesse (drift av nettside)</li>
                                    <li><strong>Analyse:</strong> Samtykke (GDPR Art. 6(1)(a))</li>
                                    <li><strong>Markedsføring:</strong> Samtykke (GDPR Art. 6(1)(a))</li>
                                </ul>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
