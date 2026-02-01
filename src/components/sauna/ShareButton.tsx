'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
    url: string;
    title?: string;
    className?: string;
}

export function ShareButton({ url, title, className }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch {
                // Fall back to clipboard
            }
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    return (
        <button type="button" onClick={handleShare} className={className}>
            {copied ? <Check size={18} style={{ marginRight: '0.5rem' }} /> : <Share2 size={18} style={{ marginRight: '0.5rem' }} />}
            {copied ? 'Lenke kopiert' : 'Del badstuen'}
        </button>
    );
}
