'use client';

export default function Loading() {
    return (
        <div style={{ padding: '2rem 1rem' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
                {/* Hero skeleton */}
                <div style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                }} />

                {/* Content skeleton */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 600px' }}>
                        <div style={{ height: '40px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem', width: '60%' }} />
                        <div style={{ height: '200px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '1rem' }} />
                        <div style={{ height: '160px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                    </div>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ height: '300px', backgroundColor: '#e2e8f0', borderRadius: '8px', marginBottom: '1rem' }} />
                        <div style={{ height: '200px', backgroundColor: '#e2e8f0', borderRadius: '8px' }} />
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
