import React from 'react';
import { clsx } from 'clsx';
import styles from './Section.module.css';

export type SectionSize = 'sm' | 'md' | 'lg';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    size?: SectionSize;
}

export function Section({ as: Component = 'section', size = 'md', className, children, ...props }: SectionProps) {
    return (
        <Component className={clsx(styles.section, styles[size], className)} {...props}>
            {children}
        </Component>
    );
}
