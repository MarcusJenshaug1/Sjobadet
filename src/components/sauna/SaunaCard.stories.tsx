import type { Meta, StoryObj } from '@storybook/react';
import { SaunaCard } from './SaunaCard';
import readme from './SaunaCard.README.md?raw';

const meta: Meta<typeof SaunaCard> = {
    title: 'Komponenter/Badstue/SaunaCard',
    component: SaunaCard,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        sauna: {
            control: 'object',
            description: 'Badstue-data som vises i kortet.',
        },
        isMaintenanceMode: {
            control: 'boolean',
            description: 'Skjuler bookingstatus og handlinger ved vedlikehold.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof SaunaCard>;

export const Standard: Story = {
    args: {
        sauna: {
            id: '1',
            name: 'Tønsberg Brygge',
            location: 'Tønsberg',
            slug: 'tonsberg-brygge',
            shortDescription: 'Vår mest populære badstue med fantastisk utsikt over havna.',
            imageUrl: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            bookingUrlDropin: '#',
            bookingUrlPrivat: '#',
            driftStatus: 'open',
            capacityDropin: 10,
            nextAvailableSlot: {
                time: '18:30',
                availableSpots: 6,
                date: new Date().toISOString()
            }
        }
    },
};

export const Stengt: Story = {
    args: {
        sauna: {
            id: '2',
            name: 'Hjemseng brygge',
            location: 'Nøtterøy',
            slug: 'hjemseng-brygge',
            shortDescription: 'En fredelig oase på vakre Nøtterøy.',
            imageUrl: 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            bookingUrlDropin: '#',
            bookingUrlPrivat: '#',
            driftStatus: 'closed'
        }
    },
};

export const FåPlasser: Story = {
    args: {
        sauna: {
            id: '3',
            name: 'Hjemseng Brygge',
            location: 'Nøtterøy',
            slug: 'hjemseng-brygge',
            shortDescription: 'Lite ledig kapasitet i dag.',
            imageUrl: 'https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            bookingUrlDropin: '#',
            bookingUrlPrivat: '#',
            driftStatus: 'open',
            capacityDropin: 8,
            nextAvailableSlot: {
                time: '20:00',
                availableSpots: 2,
                date: new Date().toISOString()
            }
        }
    },
};

export const IngenBilde: Story = {
    args: {
        sauna: {
            id: '4',
            name: 'Planlagt Badstue',
            location: 'Sandefjord',
            slug: 'sandefjord',
            shortDescription: 'Kommer snart til en havn nær deg!',
            driftStatus: 'open'
        }
    },
};

export const Vedlikehold: Story = {
    args: {
        isMaintenanceMode: true,
        sauna: {
            id: '5',
            name: 'Tønsberg Brygge',
            location: 'Tønsberg',
            slug: 'tonsberg-brygge',
            shortDescription: 'Kortet skjuler status og handlinger i vedlikeholdsmodus.',
            imageUrl: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            driftStatus: 'open'
        }
    },
};
