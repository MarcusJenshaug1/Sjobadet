'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface SaunaMapProps {
    address: string;
    mapEmbedUrl: string | null;
    saunaName: string;
}

export function SaunaMap({ address, mapEmbedUrl, saunaName }: SaunaMapProps) {
    const [showMap, setShowMap] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapEmbedUrl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShowMap(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [mapEmbedUrl]);

    if (!mapEmbedUrl) return null;

    return (
        <div ref={containerRef} style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ marginBottom: '1rem', color: '#475569' }}>{address}</p>
            <div style={{
                position: 'relative',
                flex: 1,
                backgroundColor: '#f1f5f9',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                minHeight: '300px'
            }}>
                {showMap ? (
                    <iframe
                        src={mapEmbedUrl}
                        title={`Kart over ${saunaName}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                ) : (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        padding: '2rem',
                        textAlign: 'center'
                    }}>
                        <MapPin size={48} color="#94a3b8" />
                        <button
                            onClick={() => setShowMap(true)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Last inn kart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
