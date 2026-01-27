import type { Meta, StoryObj } from '@storybook/react';
import { SaunaMediaManager } from './SaunaMediaManager';
import readme from './SaunaMediaManager.README.md?raw';

const meta: Meta<typeof SaunaMediaManager> = {
    title: 'Komponenter/Admin/SaunaMediaManager',
    component: SaunaMediaManager,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
        controls: { exclude: ['initialAssets'] },
    },
    argTypes: {
        saunaId: {
            control: 'text',
            description: 'ID for badstuen som administreres.',
        },
        initialAssets: {
            control: false,
            description: 'Startliste med eksisterende media.',
        },
    },
    args: {
        saunaId: '1',
        initialAssets: [
            { id: 'a1', kind: 'PRIMARY', storageKeyLarge: 'https://images.unsplash.com/photo-1605614307370-f7a1e58ae751?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { id: 'a2', kind: 'GALLERY', storageKeyLarge: 'https://images.unsplash.com/photo-1678988227223-45112511eca2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
            { id: 'a3', kind: 'GALLERY', storageKeyLarge: 'https://images.unsplash.com/photo-1728404259075-209cfb5bb89c?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
        ]
    },
};

export default meta;

type Story = StoryObj<typeof SaunaMediaManager>;

export const Standard: Story = {};
