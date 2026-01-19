"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [pathname]);

    return null;
}
