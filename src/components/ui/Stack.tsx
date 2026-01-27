import React from 'react';
import { clsx } from 'clsx';
import styles from './Stack.module.css';

export type StackDirection = 'row' | 'column';
export type StackGap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: StackDirection;
    gap?: StackGap;
    wrap?: boolean;
}

export function Stack({ direction = 'column', gap = 3, wrap = false, className, style, children, ...props }: StackProps) {
    return (
        <div
            className={clsx(styles.stack, styles[direction], wrap && styles.wrap, className)}
            style={{ gap: `var(--space-${gap})`, ...style }}
            {...props}
        >
            {children}
        </div>
    );
}
