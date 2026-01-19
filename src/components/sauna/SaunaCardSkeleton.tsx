'use client';

import styles from './SaunaCard.module.css';

export function SaunaCardSkeleton() {
    return (
        <div className={styles.card} aria-busy="true" aria-label="Laster badstue...">
            <div
                className={styles.imageContainer}
                style={{
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'pulse 1.5s infinite',
                }}
            />
            <div className={styles.content} style={{ gap: '0.75rem' }}>
                <div
                    style={{
                        height: '1.5rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'pulse 1.5s infinite',
                        borderRadius: '0.25rem',
                        width: '70%',
                    }}
                />
                <div
                    style={{
                        height: '0.875rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'pulse 1.5s infinite',
                        borderRadius: '0.25rem',
                        width: '50%',
                    }}
                />
                <div
                    style={{
                        height: '3rem',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
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
                        gap: '0.5rem',
                        marginTop: 'auto',
                    }}
                >
                    <div
                        style={{
                            height: '2.5rem',
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'pulse 1.5s infinite',
                            borderRadius: '0.25rem',
                        }}
                    />
                    <div
                        style={{
                            height: '2.5rem',
                            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'pulse 1.5s infinite',
                            borderRadius: '0.25rem',
                        }}
                    />
                </div>
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
