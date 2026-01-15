'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './SaunaGallery.module.css';
import { X } from 'lucide-react';

interface SaunaGalleryProps {
    images: string[];
    saunaName: string;
}

export function SaunaGallery({ images, saunaName }: SaunaGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (!images || images.length === 0) return null;

    return (
        <div className={styles.galleryContainer}>
            <h2 className={styles.title}>Galleri</h2>
            <div className={styles.grid}>
                {images.map((url, index) => (
                    <div
                        key={index}
                        className={styles.imageWrapper}
                        onClick={() => setSelectedImage(url)}
                    >
                        <Image
                            src={url}
                            alt={`${saunaName} galleri ${index + 1}`}
                            fill
                            className={styles.thumbnail}
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
                    <button className={styles.closeButton}>
                        <X size={32} />
                    </button>
                    <div className={styles.fullImageWrapper} onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={selectedImage}
                            alt="Full size"
                            fill
                            className={styles.fullImage}
                            priority
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
