import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';
import readme from './Select.README.md?raw';

const meta: Meta<typeof Select> = {
    title: 'Komponenter/Skjema/Select',
    component: Select,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Størrelse på feltets padding og tekst.',
        },
        disabled: {
            control: 'boolean',
            description: 'Deaktiverer listen.',
        },
    },
    args: {
        size: 'md',
    },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Standard: Story = {
    render: (args) => (
        <Select {...args}>
            <option value="">Velg badstue…</option>
            <option value="oslo">Oslo</option>
            <option value="bergen">Bergen</option>
            <option value="tromso">Tromsø</option>
        </Select>
    ),
};

export const Størrelser: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 320 }}>
            <Select size="sm">
                <option>Sm</option>
            </Select>
            <Select size="md">
                <option>Md</option>
            </Select>
            <Select size="lg">
                <option>Lg</option>
            </Select>
        </div>
    ),
};

export const Tilstander: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 320 }}>
            <Select>
                <option>Normal</option>
            </Select>
            <Select disabled>
                <option>Deaktivert</option>
            </Select>
        </div>
    ),
};
