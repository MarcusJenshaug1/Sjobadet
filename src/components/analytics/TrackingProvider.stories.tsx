import type { Meta, StoryObj } from '@storybook/react';
import { TrackingProvider } from './TrackingProvider';
import readme from './TrackingProvider.README.md?raw';

const meta: Meta<typeof TrackingProvider> = {
    title: 'Komponenter/Analyse/TrackingProvider',
    component: TrackingProvider,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: readme,
            },
        },
        controls: { exclude: ['children'] },
    },
    argTypes: {
        isAdmin: {
            control: 'boolean',
            description: 'Deaktiverer sporing og banner når true.',
        },
    },
    args: {
        isAdmin: false,
        children: (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                Eksempelinnhold som ligger inne i TrackingProvider.
            </div>
        )
    },
};

export default meta;

type Story = StoryObj<typeof TrackingProvider>;

export const Standard: Story = {};

export const Admin: Story = {
    args: {
        isAdmin: true,
    },
};
