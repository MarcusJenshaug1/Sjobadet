import type { Meta, StoryObj } from '@storybook/react';
import { BookingModal } from './BookingModal';
import readme from './BookingModal.README.md?raw';

const meta: Meta<typeof BookingModal> = {
    title: 'Komponenter/Badstue/BookingModal',
    component: BookingModal,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        open: {
            control: 'boolean',
            description: 'Åpner eller lukker modalen.',
        },
        url: {
            control: 'text',
            description: 'URL som vises i iframe.',
        },
        title: {
            control: 'text',
            description: 'Tittel for modal og iframe.',
        },
        onClose: {
            action: 'close',
            description: 'Kalles når modalen lukkes.',
        },
    },
    args: {
        open: true,
        url: 'about:blank',
        title: 'Fullfør booking',
    },
};

export default meta;

type Story = StoryObj<typeof BookingModal>;

export const Standard: Story = {};
