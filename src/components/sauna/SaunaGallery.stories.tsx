import type { Meta, StoryObj } from '@storybook/react';
import { SaunaGallery } from './SaunaGallery';
import readme from './SaunaGallery.README.md?raw';

const meta: Meta<typeof SaunaGallery> = {
    title: 'Komponenter/Badstue/SaunaGallery',
    component: SaunaGallery,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        images: {
            control: 'object',
            description: 'Liste over bilde-URL-er.',
        },
        saunaName: {
            control: 'text',
            description: 'Navn på badstuen (brukes i alt-tekst).',
        },
    },
};

export default meta;
type Story = StoryObj<typeof SaunaGallery>;

export const Standard: Story = {
    args: {
        saunaName: 'Tønsberg Brygge',
        images: [
            'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
};

export const EttBilde: Story = {
    args: {
        saunaName: 'Tønsberg Brygge',
        images: [
            'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
};
