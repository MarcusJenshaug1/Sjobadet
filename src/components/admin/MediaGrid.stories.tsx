import type { Meta, StoryObj } from '@storybook/react';
import { MediaGrid } from './MediaGrid';
import readme from './MediaGrid.README.md?raw';

const meta: Meta<typeof MediaGrid> = {
    title: 'Komponenter/Admin/MediaGrid',
    component: MediaGrid,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        assets: {
            control: 'object',
            description: 'Liste over mediaobjekter i gridet.',
        },
        onReorder: {
            action: 'reorder',
            description: 'Kalles når rekkefølgen endres.',
        },
        onDelete: {
            action: 'delete',
            description: 'Kalles ved sletting.',
        },
    },
};

export default meta;

type Story = StoryObj<typeof MediaGrid>;

export const Standard: Story = {
    args: {
        assets: [
            { id: '1', url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', status: 'confirmed' },
            { id: '2', url: 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', status: 'confirmed' },
            { id: '3', url: 'https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', status: 'confirmed' }
        ],
    },
};
