import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import readme from './Badge.README.md?raw';

const meta: Meta<typeof Badge> = {
    title: 'Komponenter/Status/Badge',
    component: Badge,
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
            options: ['default', 'success', 'warning', 'danger', 'info', 'neutral'],
            description: 'Fargevariant for status eller kategori.',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Størrelse på etiketten.',
        },
    },
    args: {
        variant: 'default',
        size: 'md',
        children: 'Standard',
    },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Standard: Story = {};

export const Varianter: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant="default">Standard</Badge>
            <Badge variant="success">Åpen</Badge>
            <Badge variant="warning">Begrenset</Badge>
            <Badge variant="danger">Stengt</Badge>
            <Badge variant="info">Nyhet</Badge>
            <Badge variant="neutral">Info</Badge>
        </div>
    ),
};

export const Størrelser: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Badge size="sm">Sm</Badge>
            <Badge size="md">Md</Badge>
            <Badge size="lg">Lg</Badge>
        </div>
    ),
};
