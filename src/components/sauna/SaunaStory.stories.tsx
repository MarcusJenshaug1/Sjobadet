import type { Meta, StoryObj } from '@storybook/react';
import { SaunaStory } from './SaunaStory';
import readme from './SaunaStory.README.md?raw';

const meta: Meta<typeof SaunaStory> = {
    title: 'Komponenter/Badstue/SaunaStory',
    component: SaunaStory,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: readme,
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SaunaStory>;

export const Standard: Story = {};
