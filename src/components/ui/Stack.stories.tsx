import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Button } from './Button';
import readme from './Stack.README.md?raw';

const meta: Meta<typeof Stack> = {
    title: 'Komponenter/Layout/Stack',
    component: Stack,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        direction: {
            control: 'select',
            options: ['row', 'column'],
            description: 'Retning for elementene.',
        },
        gap: {
            control: 'select',
            options: [1, 2, 3, 4, 5, 6, 7, 8],
            description: 'Mellomrom basert på spacing-tokens.',
        },
        wrap: {
            control: 'boolean',
            description: 'Tillat linjebryting når det ikke er plass.',
        },
    },
    args: {
        direction: 'row',
        gap: 3,
        wrap: false,
    },
};

export default meta;

type Story = StoryObj<typeof Stack>;

export const Standard: Story = {
    render: (args) => (
        <Stack {...args}>
            <Button size="sm">Knapp</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
        </Stack>
    ),
};

export const Vertikal: Story = {
    args: {
        direction: 'column',
        gap: 4,
    },
    render: (args) => (
        <Stack {...args}>
            <Button>Bestill</Button>
            <Button variant="secondary">Les mer</Button>
        </Stack>
    ),
};
