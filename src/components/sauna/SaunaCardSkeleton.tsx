'use client';

import styles from './SaunaCard.module.css';

export function SaunaCardSkeleton() {
    return (
        <div className={styles.card} aria-busy="true" aria-label="Laster badstue...">
            <div
                className={styles.imageContainer}
                style={{
                    background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'pulse 1.5s infinite',
                }}
            />
            <div className={styles.content} style={{ gap: '0.75rem' }}>
                <div className={styles.header}>
                    <div
                        style={{
                            height: '1.5rem',
                            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'pulse 1.5s infinite',
                            borderRadius: '0.25rem',
                            width: '70%',
                            marginBottom: '0.5rem'
                        }}
                    />
                    <div
                        style={{
                            height: '0.875rem',
                            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'pulse 1.5s infinite',
                            borderRadius: '0.25rem',
                            width: '40%',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                    <div style={{ height: '2rem', width: '120px', backgroundColor: '#f1f5f9', borderRadius: '9999px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '2rem', width: '80px', backgroundColor: '#f1f5f9', borderRadius: '9999px', animation: 'pulse 1.5s infinite' }} />
                </div>

                <div
                    style={{
                        height: '3rem',
                        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'pulse 1.5s infinite',
                        borderRadius: '0.25rem',
                        marginTop: '0.5rem',
                    }}
                />
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        marginTop: 'auto',
                    }}
                >
                    <div
                        style={{
                            height: '2.5rem',
                            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'pulse 1.5s infinite',
                            borderRadius: '10px',
                        }}
                    />
                    <div
                        style={{
                            height: '2.5rem',
                            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'pulse 1.5s infinite',
                            borderRadius: '10px',
                        }}
                    />
                </div>
                <div
                    style={{
                        height: '2.5rem',
                        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'pulse 1.5s infinite',
                        borderRadius: '10px',
                        marginTop: '0.75rem'
                    }}
                />
            </div>
            <style>{`
                @keyframes pulse {
                    0%, 100% {
                        background-position: 200% 0;
                    }
                    50% {
                        background-position: -200% 0;
                    }
                }
            `}</style>
        </div>
    );
}
