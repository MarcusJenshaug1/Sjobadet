import React from 'react';
import { clsx } from 'clsx';
import styles from './Select.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    size?: SelectSize;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ size = 'md', className, children, ...props }, ref) => (
        <select ref={ref} className={clsx(styles.select, styles[size], className)} {...props}>
            {children}
        </select>
    )
);

Select.displayName = 'Select';
