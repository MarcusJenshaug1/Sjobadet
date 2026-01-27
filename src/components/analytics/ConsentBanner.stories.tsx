import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ConsentBanner } from './ConsentBanner';
import readme from './ConsentBanner.README.md?raw';

const meta: Meta<typeof ConsentBanner> = {
    title: 'Komponenter/Analyse/ConsentBanner',
    component: ConsentBanner,
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

type Story = StoryObj<typeof ConsentBanner>;

export const Standard: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Tilpass' });
        await expect(button).toBeInTheDocument();
    },
};

export const Dialog: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(await canvas.findByRole('button', { name: 'Tilpass' }));
        await expect(canvas.getByRole('heading', { name: 'Innstillinger for infokapsler' })).toBeInTheDocument();
    },
};
