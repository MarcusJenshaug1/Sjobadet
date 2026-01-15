import React from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'default' | 'sm' | 'lg';
    fullWidth?: boolean;
    href?: string;
    external?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', fullWidth, href, external, children, disabled, ...props }, ref) => {
        const rootClassName = clsx(
            styles.button,
            styles[variant],
            size !== 'default' && styles[size],
            fullWidth && styles.fullWidth,
            className
        );

        if (href && !disabled) {
            if (external) {
                return (
                    <a href={href} className={rootClassName} target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                );
            }
            return (
                <Link href={href} className={rootClassName}>
                    {children}
                </Link>
            );
        }

        return (
            <button ref={ref} className={rootClassName} disabled={disabled} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
