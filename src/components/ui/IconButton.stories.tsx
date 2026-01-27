import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { X, Search, Heart } from 'lucide-react';
import { IconButton } from './IconButton';
import readme from './IconButton.README.md?raw';

const meta: Meta<typeof IconButton> = {
    title: 'Komponenter/Knapper/IconButton',
    component: IconButton,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['ghost', 'outline', 'solid'],
            description: 'Visuell variant for ikonknappen.',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Størrelse på knapp og ikon.',
        },
    },
    args: {
        variant: 'ghost',
        size: 'md',
    },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Standard: Story = {
    args: {
        'aria-label': 'Lukk',
        children: <X size={18} />,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: 'Lukk' });
        await userEvent.click(button);
        await expect(button).toBeEnabled();
    },
};

export const Varianter: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <IconButton aria-label="Søk" variant="ghost">
                <Search size={18} />
            </IconButton>
            <IconButton aria-label="Favoritt" variant="outline">
                <Heart size={18} />
            </IconButton>
            <IconButton aria-label="Lukk" variant="solid">
                <X size={18} />
            </IconButton>
        </div>
    ),
};

export const Størrelser: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <IconButton aria-label="Liten" size="sm">
                <X size={14} />
            </IconButton>
            <IconButton aria-label="Standard" size="md">
                <X size={18} />
            </IconButton>
            <IconButton aria-label="Stor" size="lg">
                <X size={22} />
            </IconButton>
        </div>
    ),
};
