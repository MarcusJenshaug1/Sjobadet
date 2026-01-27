import React from 'react';
import styles from './Button.module.css';
import { clsx } from 'clsx';
import Link from 'next/link';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'default' | 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    href?: string;
    external?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', fullWidth, href, external, children, disabled, onClick, ...props }, ref) => {
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
                    <a href={href} className={rootClassName} target="_blank" rel="noopener noreferrer" onClick={onClick}>
                        {children}
                    </a>
                );
            }
            return (
                <Link href={href} className={rootClassName} onClick={onClick}>
                    {children}
                </Link>
            );
        }

        return (
            <button ref={ref} className={rootClassName} disabled={disabled} onClick={onClick} {...props}>
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
