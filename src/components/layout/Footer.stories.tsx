import type { Meta, StoryObj } from '@storybook/react';
import { FooterView } from './Footer';

const meta: Meta<typeof FooterView> = {
    title: 'Components/Layout/Footer',
    component: FooterView,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FooterView>;

export const Default: Story = {
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
