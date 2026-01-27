import React from 'react';
import { clsx } from 'clsx';
import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    size?: TextareaSize;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ size = 'md', className, ...props }, ref) => (
        <textarea ref={ref} className={clsx(styles.textarea, styles[size], className)} {...props} />
    )
);

Textarea.displayName = 'Textarea';
