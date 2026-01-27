import type { Meta, StoryObj } from '@storybook/react';
import { ErrorBoundary } from './ErrorBoundary';
import readme from './ErrorBoundary.README.md?raw';

const meta: Meta<typeof ErrorBoundary> = {
    title: 'Komponenter/Layout/ErrorBoundary',
    component: ErrorBoundary,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        fallback: {
            control: false,
            description: 'Egendefinert fallback-visning.',
        },
    },
};

export default meta;

type Story = StoryObj<typeof ErrorBoundary>;

const Broken = () => {
    throw new Error('Simulert feil');
};

export const Standard: Story = {
    render: () => (
        <ErrorBoundary>
            <Broken />
        </ErrorBoundary>
    ),
};

export const EgendefinertFallback: Story = {
    render: () => (
        <ErrorBoundary
            fallback={(error, reset) => (
                <div style={{ padding: '1rem', borderRadius: '0.5rem', background: '#fff7ed', border: '1px solid #fed7aa' }}>
                    <strong>Feil: </strong>{error.message}
                    <div style={{ marginTop: '0.75rem' }}>
                        <button onClick={reset} style={{ padding: '0.5rem 0.75rem' }}>Prøv igjen</button>
                    </div>
                </div>
            )}
        >
            <Broken />
        </ErrorBoundary>
    ),
};
