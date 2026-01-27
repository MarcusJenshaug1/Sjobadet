import React from 'react';
import { clsx } from 'clsx';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    as?: React.ElementType;
}

export function Container({ as: Component = 'div', className, children, ...props }: ContainerProps) {
    return (
        <Component className={clsx('container', className)} {...props}>
            {children}
        </Component>
    );
}
