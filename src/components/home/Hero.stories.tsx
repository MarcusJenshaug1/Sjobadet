import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from './Hero';
import readme from './Hero.README.md?raw';

const meta: Meta<typeof Hero> = {
    title: 'Komponenter/Hjem/Hero',
    component: Hero,
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
type Story = StoryObj<typeof Hero>;

export const Standard: Story = {};
