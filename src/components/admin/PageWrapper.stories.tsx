import type { Meta, StoryObj } from '@storybook/react';
import { PageWrapper } from './PageWrapper';
import { Button } from '../ui/Button';
import readme from './PageWrapper.README.md?raw';

const meta: Meta<typeof PageWrapper> = {
    title: 'Komponenter/Admin/PageWrapper',
    component: PageWrapper,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        layout: {
            control: 'select',
            options: ['narrow', 'wide', 'fluid'],
            description: 'Bredde på innholdskolonnen.',
        },
        title: {
            control: 'text',
            description: 'Sidetittel.',
        },
    },
    args: {
        title: 'Badstuer',
        layout: 'wide',
        actions: <Button size="sm">Ny badstue</Button>,
    },
};

export default meta;

type Story = StoryObj<typeof PageWrapper>;

export const Standard: Story = {
    render: (args) => (
        <PageWrapper {...args}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                Innhold for adminsiden.
            </div>
        </PageWrapper>
    ),
};
