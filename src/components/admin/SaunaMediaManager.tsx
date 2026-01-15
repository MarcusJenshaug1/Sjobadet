'use client';

import React, { useState, useEffect } from 'react';
import { MediaDropzone } from './MediaDropzone';
import { MediaGrid } from './MediaGrid';
import { MediaItem, MediaAssetUI } from './MediaItem';
import styles from './MediaManager.module.css';

interface SaunaMediaManagerProps {
    saunaId: string;
    initialAssets?: any[]; // From DB
}

export function SaunaMediaManager({ saunaId, initialAssets = [] }: SaunaMediaManagerProps) {
    const [assets, setAssets] = useState<MediaAssetUI[]>(
        initialAssets
            .filter(a => {
                const url = (a.storageKeyThumb || a.storageKeyLarge || '').trim();
                return url && url !== 'pending' && (url.startsWith('/') || url.startsWith('blob:') || url.startsWith('http'));
            })
            .map(a => ({
                id: a.id,
                url: (a.storageKeyThumb || a.storageKeyLarge)!.trim(),
                status: 'confirmed',
                kind: a.kind
            }))
    );

    const primaryAsset = assets.find(a => a.kind === 'PRIMARY');
    const galleryAssets = assets.filter(a => a.kind === 'GALLERY');

    const handleFiles = async (files: File[], kind: 'PRIMARY' | 'GALLERY') => {
        for (const file of files) {
            await uploadFile(file, kind);
        }
    };

    const uploadFile = async (file: File, kind: 'PRIMARY' | 'GALLERY') => {
        const tempId = Math.random().toString(36).substring(7);
        const previewUrl = URL.createObjectURL(file);

        const newAsset: MediaAssetUI = {
            id: tempId,
            url: previewUrl,
            status: 'uploading',
            progress: 0
        };

        setAssets(prev => kind === 'PRIMARY' ? [newAsset, ...prev.filter(a => initialAssets.find(ia => ia.id === a.id)?.kind !== 'PRIMARY')] : [...prev, newAsset]);

        try {
            // 1. Init
            const initRes = await fetch('/api/media/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    saunaId,
                    kind,
                    filename: file.name,
                    mimeType: file.type,
                    fileSize: file.size
                })
            });

            const { assetId, uploadUrl, error: initError } = await initRes.json();
            if (initError) throw new Error(initError);

            // 2. Upload (PUT binary)
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', uploadUrl, true);
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setAssets(prev => prev.map(a => a.id === tempId ? { ...a, progress, status: progress === 100 ? 'processing' : 'uploading' } : a));
                }
            };

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve(JSON.parse(xhr.response)) : reject(new Error('Upload failed'));
                xhr.onerror = () => reject(new Error('Network error'));
            });

            xhr.send(file);
            const processedAsset = await uploadPromise as any;

            // 3. Confirm
            const confirmRes = await fetch('/api/media/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assetId,
                    saunaId,
                    kind,
                    orderIndex: kind === 'GALLERY' ? galleryAssets.length : 0
                })
            });

            const { allAssets, error: confirmError } = await confirmRes.json();
            if (confirmError) throw new Error(confirmError);

            // Update state with final confirmed assets from server
            setAssets(allAssets.map((a: any) => ({
                id: a.id,
                url: (a.storageKeyThumb || a.storageKeyLarge)?.trim() || '',
                status: 'confirmed',
                kind: a.kind
            })));

        } catch (err: any) {
            console.error('Upload error:', err);
            setAssets(prev => prev.map(a => a.id === tempId ? { ...a, status: 'error', error: err.message } : a));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Er du sikker på at du vil slette dette bildet?')) return;

        try {
            const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAssets(prev => prev.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error('Delete error', err);
        }
    };

    const handleReorder = async (newGallery: MediaAssetUI[]) => {
        // Optimistic update
        const newAssets = primaryAsset ? [primaryAsset, ...newGallery] : newGallery;
        setAssets(newAssets);

        try {
            const assetOrders = newGallery.map((a, index) => ({ id: a.id, orderIndex: index }));
            await fetch('/api/media/reorder', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saunaId, assetOrders })
            });
        } catch (err) {
            console.error('Reorder sync error', err);
        }
    };

    return (
        <div className={styles.container}>
            {/* Hidden fields for form submission */}
            <input type="hidden" name="imageUrl" value={primaryAsset?.url || ''} />
            <input type="hidden" name="gallery" value={JSON.stringify(galleryAssets.map(a => a.url))} />

            {/* Primary Image */}
            <div className={styles.section} style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', border: '2px dashed #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <label className={styles.label} style={{ fontSize: '1.1rem', color: '#1e293b', marginBottom: 0 }}>Hovedbilde</label>
                    {primaryAsset && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                            Aktivt
                        </span>
                    )}
                </div>
                {primaryAsset ? (
                    <div style={{ maxWidth: '300px' }}>
                        <MediaItem
                            asset={primaryAsset}
                            onDelete={handleDelete}
                            isPrimary
                        />
                    </div>
                ) : (
                    <MediaDropzone onFilesSelected={(f) => handleFiles(f, 'PRIMARY')} />
                )}
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem' }}>Dette er bildet som vises på forsiden og øverst på badstue-siden.</p>
            </div>

            {/* Gallery */}
            <div className={styles.section} style={{ marginTop: '2rem' }}>
                <label className={styles.label} style={{ fontSize: '1.1rem', color: '#1e293b' }}>Galleri (0-20 bilder)</label>
                <div style={{ marginBottom: '1rem' }}>
                    <MediaGrid
                        assets={galleryAssets}
                        onReorder={handleReorder}
                        onDelete={handleDelete}
                    />
                </div>
                {galleryAssets.length < 20 && (
                    <MediaDropzone
                        onFilesSelected={(f) => handleFiles(f, 'GALLERY')}
                        multiple
                    />
                )}
            </div>
        </div>
    );
}
