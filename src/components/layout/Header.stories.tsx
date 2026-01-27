import type { Meta, StoryObj } from '@storybook/react';
import { HeaderView } from './HeaderView';
import readme from './HeaderView.README.md?raw';

const meta: Meta<typeof HeaderView> = {
    title: 'Komponenter/Layout/Header',
    component: HeaderView,
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
        isAdmin: {
            control: 'boolean',
            description: 'Viser adminlenke når brukeren er admin.',
        },
        isMaintenanceMode: {
            control: 'boolean',
            description: 'Deaktiverer lenker når vedlikehold er aktivt.',
        },
        saunaLinks: {
            control: 'object',
            description: 'Menylenker til badstuer.',
        },
        infoLinks: {
            control: 'object',
            description: 'Menylenker til infosider.',
        },
    },
    args: {
        isAdmin: false,
        isMaintenanceMode: false,
        saunaLinks: [
            { label: 'Tønsberg Brygge', href: '/home/tonsberg' },
            { label: 'Hjemseng Brygge', href: '/home/hjemseng' },
        ],
        infoLinks: [
            { label: 'Ofte stilte spørsmål', href: '/info/faq' },
            { label: 'Åpningstider', href: '/info/apningstider' },
        ],
    },
};

export default meta;
type Story = StoryObj<typeof HeaderView>;

export const Standard: Story = {};

export const Vedlikehold: Story = {
    args: {
        isMaintenanceMode: true,
    },
};
