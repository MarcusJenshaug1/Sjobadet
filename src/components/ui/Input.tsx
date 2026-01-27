import React from 'react';
import { clsx } from 'clsx';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: InputSize;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ size = 'md', className, ...props }, ref) => (
        <input ref={ref} className={clsx(styles.input, styles[size], className)} {...props} />
    )
);

Input.displayName = 'Input';
