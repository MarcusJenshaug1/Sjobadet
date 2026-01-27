import type { Meta, StoryObj } from '@storybook/react';
import { FooterView } from './Footer';
import readme from './Footer.README.md?raw';

const meta: Meta<typeof FooterView> = {
    title: 'Komponenter/Layout/Footer',
    component: FooterView,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        address: {
            control: 'text',
            description: 'Adresse som vises i footer.',
        },
        email: {
            control: 'text',
            description: 'Kontakt e-postadresse.',
        },
        phone: {
            control: 'text',
            description: 'Telefonnummer.',
        },
        instagram: {
            control: 'text',
            description: 'Instagram-lenke.',
        },
        facebook: {
            control: 'text',
            description: 'Facebook-lenke.',
        },
        saunas: {
            control: 'object',
            description: 'Liste over badstuer som vises i footer.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof FooterView>;

export const Standard: Story = {
    args: {
        address: 'Nedre Langgate 44, 3126 Tønsberg',
        email: 'booking@sjobadet.com',
        phone: '+47 401 55 365',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
        saunas: [
            {
                id: '1',
                slug: 'tonsberg-brygge',
                name: 'Tønsberg Brygge',
                location: 'Tønsberg',
                shortDescription: 'Badstue ved brygga',
                capacityDropin: 8,
                capacityPrivat: 10,
                driftStatus: 'open',
                flexibleHours: false
            },
            {
                id: '2',
                slug: 'hjemseng-brygge',
                name: 'Hjemseng brygge',
                location: 'Hjemseng',
                shortDescription: 'Badstue med sjøutsikt',
                capacityDropin: 6,
                capacityPrivat: 8,
                driftStatus: 'closed',
                stengeArsak: 'Is på vannet'
            }
        ]
    },
};
