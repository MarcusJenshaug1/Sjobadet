import type { Meta, StoryObj } from '@storybook/react';
import { MaintenanceContent } from './MaintenanceContent';
import readme from './MaintenanceContent.README.md?raw';

const meta: Meta<typeof MaintenanceContent> = {
    title: 'Komponenter/Vedlikehold/MaintenanceContent',
    component: MaintenanceContent,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: readme,
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof MaintenanceContent>;

export const Standard: Story = {
    args: {
        generatedAt: '26.01.2026 12:00',
        saunas: [
            {
                id: '1',
                slug: 'tonsberg-brygge',
                name: 'Tønsberg Brygge',
                location: 'Tønsberg',
                imageUrl: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                bookingUrlDropin: '#',
                bookingUrlPrivat: '#',
                driftStatus: 'open'
            },
            {
                id: '2',
                slug: 'hjemseng-brygge',
                name: 'Hjemseng Brygge',
                location: 'Nøtterøy',
                imageUrl: 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                bookingUrlDropin: '#',
                bookingUrlPrivat: '#',
                driftStatus: 'closed'
            }
        ]
    },
};

export const IngenBadstuer: Story = {
    args: {
        generatedAt: '26.01.2026 12:00',
        saunas: [],
    },
};
