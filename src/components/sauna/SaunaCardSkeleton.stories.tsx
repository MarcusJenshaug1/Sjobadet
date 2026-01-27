import type { Meta, StoryObj } from '@storybook/react';
import { SaunaCardSkeleton } from './SaunaCardSkeleton';
import readme from './SaunaCardSkeleton.README.md?raw';

const meta: Meta<typeof SaunaCardSkeleton> = {
    title: 'Komponenter/Badstue/SaunaCardSkeleton',
    component: SaunaCardSkeleton,
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

type Story = StoryObj<typeof SaunaCardSkeleton>;

export const Standard: Story = {};
