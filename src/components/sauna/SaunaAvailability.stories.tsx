import type { Meta, StoryObj } from '@storybook/react';
import SaunaAvailability from './SaunaAvailability';
import readme from './SaunaAvailability.README.md?raw';

const meta: Meta<typeof SaunaAvailability> = {
    title: 'Komponenter/Badstue/SaunaAvailability',
    component: SaunaAvailability,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        saunaId: {
            control: 'text',
            description: 'ID for badstuen som skal hentes.',
        },
        capacityDropin: {
            control: 'number',
            description: 'Kapasitet for drop-in.',
        },
        showAvailability: {
            control: 'boolean',
            description: 'Skjul/vis komponenten.',
        },
    },
    args: {
        saunaId: 'demo',
        capacityDropin: 10,
        showAvailability: true,
    },
};

export default meta;

type Story = StoryObj<typeof SaunaAvailability>;

export const Standard: Story = {};

export const Skjult: Story = {
    args: {
        showAvailability: false,
    },
};
