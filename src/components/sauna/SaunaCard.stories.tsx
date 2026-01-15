import type { Meta, StoryObj } from '@storybook/react';
import { SaunaCard } from './SaunaCard';

const meta: Meta<typeof SaunaCard> = {
    title: 'Components/Sauna/SaunaCard',
    component: SaunaCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SaunaCard>;

export const Default: Story = {
    args: {
        sauna: {
            id: '1',
            name: 'Tønsberg Brygge',
            location: 'Tønsberg',
            slug: 'tonsberg-brygge',
            shortDescription: 'Vår mest populære badstue med fantastisk utsikt over havna.',
            imageUrl: 'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_7224.jpg?etag=null&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=685%2B514&extract=151%2B0%2B514%2B514&quality=85',
            bookingUrlDropin: '#',
            bookingUrlPrivat: '#',
            driftStatus: 'open'
        }
    },
};

export const Closed: Story = {
    args: {
        sauna: {
            id: '2',
            name: 'Hjemseng brygge',
            location: 'Nøtterøy',
            slug: 'hjemseng-brygge',
            shortDescription: 'En fredelig oase på vakre Nøtterøy.',
            imageUrl: 'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_3888.jpeg?etag=undefined&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=607%2B455&extract=0%2B0%2B546%2B417&quality=85',
            bookingUrlDropin: '#',
            bookingUrlPrivat: '#',
            driftStatus: 'closed'
        }
    },
};

export const NoImage: Story = {
    args: {
        sauna: {
            id: '3',
            name: 'Planlagt Badstue',
            location: 'Sandefjord',
            slug: 'sandefjord',
            shortDescription: 'Kommer snart til en havn nær deg!',
            driftStatus: 'open'
        }
    },
};
