import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import readme from './Card.README.md?raw';

const meta: Meta<typeof Card> = {
    title: 'Komponenter/Overflate/Card',
    component: Card,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'muted', 'outline'],
            description: 'Visuell variant for bakgrunn og kantlinje.',
        },
        padding: {
            control: 'select',
            options: ['none', 'sm', 'md', 'lg'],
            description: 'Innvendig padding.',
        },
        as: {
            control: 'text',
            description: 'Semantisk element (f.eks. `section`).',
        },
    },
    args: {
        variant: 'default',
        padding: 'md',
    },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Standard: Story = {
    args: {
        children: (
            <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Kort med innhold</h3>
                <p>Brukes for grupperte seksjoner og paneler.</p>
            </div>
        ),
    },
};

export const Varianter: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '1rem', maxWidth: 420 }}>
            <Card>
                <strong>Standard</strong>
                <p>Standard bakgrunn for primært innhold.</p>
            </Card>
            <Card variant="muted">
                <strong>Dempet</strong>
                <p>Brukes for sekundært innhold.</p>
            </Card>
            <Card variant="outline">
                <strong>Outline</strong>
                <p>Transparent med kantlinje.</p>
            </Card>
        </div>
    ),
};

export const Padding: Story = {
    args: {
        padding: 'lg',
        children: 'Ekstra romslig padding for innhold som skal puste.',
    },
};
