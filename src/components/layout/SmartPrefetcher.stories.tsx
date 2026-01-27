import type { Meta, StoryObj } from '@storybook/react';
import { SmartPrefetcher } from './SmartPrefetcher';
import readme from './SmartPrefetcher.README.md?raw';

const meta: Meta<typeof SmartPrefetcher> = {
    title: 'Komponenter/Layout/SmartPrefetcher',
    component: SmartPrefetcher,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
        controls: { disable: true },
    },
};

export default meta;

type Story = StoryObj<typeof SmartPrefetcher>;

export const Standard: Story = {
    render: () => (
        <div>
            <SmartPrefetcher />
            <p>Denne komponenten prefetcher ruter i bakgrunnen uten å vise UI.</p>
        </div>
    ),
};
