import React from 'react';
import { clsx } from 'clsx';
import styles from './IconButton.module.css';

export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonVariant = 'ghost' | 'outline' | 'solid';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: IconButtonSize;
    variant?: IconButtonVariant;
}

export function IconButton({
    size = 'md',
    variant = 'ghost',
    className,
    children,
    ...props
}: IconButtonProps) {
    return (
        <button
            className={clsx(styles.button, styles[size], styles[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
