import type { Meta, StoryObj } from '@storybook/react';
import { ScrollToTop } from './ScrollToTop';
import readme from './ScrollToTop.README.md?raw';

const meta: Meta<typeof ScrollToTop> = {
    title: 'Komponenter/Layout/ScrollToTop',
    component: ScrollToTop,
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

type Story = StoryObj<typeof ScrollToTop>;

export const Standard: Story = {
    render: () => (
        <div>
            <ScrollToTop />
            <p>Denne komponenten har ingen visuell representasjon.</p>
        </div>
    ),
};
