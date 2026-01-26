'use client';

import React from 'react';
import styles from './MediaManager.module.css';
import { X, Loader2, AlertCircle, GripVertical } from 'lucide-react';
import Image from 'next/image';

export interface MediaAssetUI {
    id: string;
    url: string;
    status: 'pending' | 'uploading' | 'processing' | 'confirmed' | 'error';
    kind?: 'PRIMARY' | 'GALLERY';
    progress?: number;
    error?: string;
}

interface MediaItemProps {
    asset: MediaAssetUI;
    onDelete: (id: string) => void;
    onRetry?: (id: string) => void;
    isPrimary?: boolean;
    dragHandleProps?: Record<string, unknown>; // For dnd-kit
}

export function MediaItem({ asset, onDelete, onRetry, isPrimary, dragHandleProps }: MediaItemProps) {
    const isUploading = asset.status === 'uploading' || asset.status === 'processing' || asset.status === 'pending';
    const hasError = asset.status === 'error';

    return (
        <div className={styles.item}>
            {isPrimary && <div className={styles.primaryBadge}>HOVEDBILDE</div>}

            {asset.url && asset.url !== 'pending' && (asset.url.startsWith('/') || asset.url.startsWith('blob:') || asset.url.startsWith('http')) ? (
                <Image
                    src={asset.url.trim()}
                    alt="Preview"
                    width={200}
                    height={200}
                    className={styles.img}
                    unoptimized={asset.url.trim().startsWith('blob:')}
                />
            ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eee' }}>
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <span style={{ fontSize: '10px', color: '#888' }}>Ingen bilde</span>}
                </div>
            )}

            {isUploading && (
                <div className={styles.overlay}>
                    <Loader2 className="animate-spin" size={24} />
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        {asset.status === 'processing' ? 'Behandler...' : `Laster opp (${asset.progress ?? 0}%)`}
                    </p>
                    <div className={styles.progress}>
                        <div className={styles.progressBar} style={{ width: `${asset.progress ?? 0}%` }} />
                    </div>
                </div>
            )}

            {hasError && (
                <div className={styles.overlay} style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }}>
                    <AlertCircle size={24} />
                    <p className={styles.errorMessage}>{asset.error || 'Feil ved opplasting'}</p>
                    <button
                        type="button"
                        onClick={() => onRetry?.(asset.id)}
                        style={{ marginTop: '0.5rem', fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        Prøv igjen
                    </button>
                </div>
            )}

            {!isUploading && (
                <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => onDelete(asset.id)}
                    aria-label="Slett bilde"
                >
                    <X size={16} />
                </button>
            )}

            {dragHandleProps && (
                <div {...dragHandleProps} className={styles.handle}>
                    <GripVertical size={16} />
                </div>
            )}
        </div>
    );
}
