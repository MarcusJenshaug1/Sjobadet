import type { Meta, StoryObj } from '@storybook/react';
import { MediaDropzone } from './MediaDropzone';
import readme from './MediaDropzone.README.md?raw';

const meta: Meta<typeof MediaDropzone> = {
    title: 'Komponenter/Admin/MediaDropzone',
    component: MediaDropzone,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        onFilesSelected: {
            action: 'filesSelected',
            description: 'Kalles med gyldige filer etter dropp/valg.',
        },
        multiple: {
            control: 'boolean',
            description: 'Tillat flere filer samtidig.',
        },
        accept: {
            control: 'text',
            description: 'MIME-typer som aksepteres.',
        },
        maxSize: {
            control: 'number',
            description: 'Maks størrelse i MB.',
        },
    },
    args: {
        multiple: true,
        maxSize: 10,
    },
};

export default meta;

type Story = StoryObj<typeof MediaDropzone>;

export const Standard: Story = {};
