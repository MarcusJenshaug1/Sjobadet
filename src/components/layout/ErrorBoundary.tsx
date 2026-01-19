'use client';

import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    resetError = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            return this.props.fallback ? (
                this.props.fallback(this.state.error, this.resetError)
            ) : (
                <div
                    style={{
                        padding: '2rem',
                        backgroundColor: '#fff5f5',
                        border: '1px solid #feb2b2',
                        borderRadius: '0.75rem',
                        textAlign: 'center',
                    }}
                    role="alert"
                >
                    <AlertTriangle
                        size={48}
                        color="#f56565"
                        style={{ margin: '0 auto 1rem', display: 'block' }}
                        aria-hidden="true"
                    />
                    <h2 style={{ color: '#c53030', marginBottom: '0.5rem' }}>Noe gikk galt</h2>
                    <p style={{ color: '#9b2c2c', marginBottom: '1.5rem' }}>
                        Vi opplevde et teknisk problem. Vennligst prøv igjen.
                    </p>
                    <button
                        onClick={this.resetError}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                    >
                        Prøv igjen
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
