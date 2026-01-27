import React from 'react';
import { clsx } from 'clsx';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: BadgeSize;
}

export function Badge({ variant = 'default', size = 'md', className, children, ...props }: BadgeProps) {
    return (
        <span
            className={clsx(styles.badge, styles[variant], styles[size], className)}
            {...props}
        >
            {children}
        </span>
    );
}
