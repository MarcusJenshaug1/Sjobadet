import type { Meta, StoryObj } from '@storybook/react';
import SaunaBookingOptions from './SaunaBookingOptions';
import readme from './SaunaBookingOptions.README.md?raw';

const meta: Meta<typeof SaunaBookingOptions> = {
    title: 'Komponenter/Badstue/SaunaBookingOptions',
    component: SaunaBookingOptions,
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
            description: 'ID for badstuen.',
        },
        saunaName: {
            control: 'text',
            description: 'Navn på badstuen.',
        },
        capacityDropin: {
            control: 'number',
            description: 'Kapasitet for drop-in.',
        },
        capacityPrivat: {
            control: 'number',
            description: 'Kapasitet for privat booking.',
        },
    },
    args: {
        saunaId: '1',
        saunaName: 'Tønsberg Brygge',
        capacityDropin: 8,
        capacityPrivat: 10,
        bookingUrlDropin: 'about:blank',
        bookingUrlPrivat: 'about:blank',
    },
};

export default meta;

type Story = StoryObj<typeof SaunaBookingOptions>;

export const Standard: Story = {};

export const KunPrivat: Story = {
    args: {
        capacityDropin: 0,
        bookingUrlDropin: null,
    },
};
