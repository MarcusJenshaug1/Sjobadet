'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from './SaunaGallery.module.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface SaunaGalleryProps {
    images: string[];
    saunaName: string;
}

export function SaunaGallery({ images, saunaName }: SaunaGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images.length]);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images.length]);

    const handleClose = useCallback(() => {
        setIsLightboxOpen(false);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, handleNext, handlePrev, handleClose]);

    if (!images || images.length === 0) return null;

    return (
        <div className={styles.gallerySection}>
            <h2 className={styles.title}>Galleri</h2>

            <div className={styles.slideshowContainer}>
                {/* Main Image */}
                <div className={styles.mainImageWrapper} onClick={() => setIsLightboxOpen(true)}>
                    <Image
                        src={images[currentIndex]}
                        alt={`${saunaName} galleri ${currentIndex + 1}`}
                        fill
                        className={styles.mainImage}
                        sizes="(max-width: 1200px) 100vw, 800px"
                        quality={85}
                        loading="lazy"
                    />

                    {images.length > 1 && (
                        <>
                            <button className={styles.slideNavPrev} onClick={handlePrev} aria-label="Forrige bilde">
                                <ChevronLeft size={24} />
                            </button>
                            <button className={styles.slideNavNext} onClick={handleNext} aria-label="Neste bilde">
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    <div className={styles.imageOverlay}>
                        <span>Klikk for fullskjerm</span>
                    </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className={styles.thumbnailRow}>
                        {images.map((url, index) => (
                            <button
                                key={index}
                                className={`${styles.thumbnailWrapper} ${index === currentIndex ? styles.thumbnailActive : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <Image
                                    src={url}
                                    alt={`${saunaName} miniatyr ${index + 1}`}
                                    fill
                                    className={styles.thumbnailImage}
                                    sizes="100px"
                                    quality={70}
                                    loading="lazy"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className={styles.lightboxOverlay} onClick={handleClose}>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <X size={32} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button className={styles.lightboxNavLeft} onClick={handlePrev}>
                                <ChevronLeft size={48} />
                            </button>
                            <button className={styles.lightboxNavRight} onClick={handleNext}>
                                <ChevronRight size={48} />
                            </button>
                        </>
                    )}

                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={images[currentIndex]}
                            alt={`${saunaName} full view`}
                            fill
                            className={styles.fullImage}
                            priority
                            sizes="90vw"
                        />
                        <div className={styles.imageCounter}>
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
