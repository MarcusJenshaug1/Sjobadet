'use client';

import React, { useRef, useState } from 'react';
import styles from './MediaManager.module.css';
import { Upload } from 'lucide-react';

interface MediaDropzoneProps {
    onFilesSelected: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
    maxSize?: number; // in MB
}

export function MediaDropzone({
    onFilesSelected,
    multiple = false,
    accept = 'image/jpeg,image/png,image/webp',
    maxSize = 10
}: MediaDropzoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const validFiles = Array.from(files).filter(file => {
            const isTypeValid = accept.includes(file.type);
            const isSizeValid = file.size <= maxSize * 1024 * 1024;
            return isTypeValid && isSizeValid;
        });

        if (validFiles.length > 0) {
            onFilesSelected(validFiles);
        } else {
            alert(`Vennligst velg gyldige bilder (JPG, PNG, WebP) under ${maxSize}MB.`);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div
            className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                multiple={multiple}
                accept={accept}
                onChange={(e) => handleFiles(e.target.files)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <Upload size={32} color="#6b7280" />
                <div>
                    <p style={{ fontWeight: 500, color: '#374151' }}>
                        {multiple ? 'Velg eller dra bilder hit' : 'Velg eller dra bilde hit'}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        JPG, PNG, WebP opptil {maxSize}MB
                    </p>
                </div>
            </div>
        </div>
    );
}
