import type { Meta, StoryObj } from '@storybook/react';
import { SaunaStory } from './SaunaStory';

const meta: Meta<typeof SaunaStory> = {
    title: 'Sauna/SaunaStory',
    component: SaunaStory,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SaunaStory>;

export const Default: Story = {
    args: {},
};
