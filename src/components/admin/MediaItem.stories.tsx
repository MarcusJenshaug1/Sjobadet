import type { Meta, StoryObj } from '@storybook/react';
import { MediaItem } from './MediaItem';
import readme from './MediaItem.README.md?raw';

const meta: Meta<typeof MediaItem> = {
    title: 'Komponenter/Admin/MediaItem',
    component: MediaItem,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof MediaItem>;

export const Bekreftet: Story = {
    args: {
        asset: {
            id: '1',
            url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            status: 'confirmed'
        },
        onDelete: (id) => console.log('Delete', id)
    },
};

export const LasterOpp: Story = {
    args: {
        asset: {
            id: '2',
            url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            status: 'uploading',
            progress: 45
        },
        onDelete: (id) => console.log('Delete', id)
    },
};

export const Behandler: Story = {
    args: {
        asset: {
            id: '3',
            url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            status: 'processing'
        },
        onDelete: (id) => console.log('Delete', id)
    },
};

export const Feil: Story = {
    args: {
        asset: {
            id: '4',
            url: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            status: 'error',
            error: 'Filen er for stor'
        },
        onDelete: (id) => console.log('Delete', id)
    },
};
