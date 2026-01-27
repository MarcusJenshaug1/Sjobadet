import React from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'muted' | 'outline';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    variant?: CardVariant;
    padding?: CardPadding;
}

export function Card({
    as: Component = 'div',
    variant = 'default',
    padding = 'md',
    className,
    children,
    ...props
}: CardProps) {
    const paddingClass =
        padding === 'none'
            ? styles.paddingNone
            : padding === 'sm'
                ? styles.paddingSm
                : padding === 'lg'
                    ? styles.paddingLg
                    : styles.paddingMd;

    return (
        <Component
            className={clsx(styles.card, styles[variant], paddingClass, className)}
            {...props}
        >
            {children}
        </Component>
    );
}
