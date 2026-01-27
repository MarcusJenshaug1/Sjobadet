import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import readme from './Container.README.md?raw';

const meta: Meta<typeof Container> = {
    title: 'Komponenter/Layout/Container',
    component: Container,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        as: {
            control: 'text',
            description: 'Semantisk element (f.eks. `main`).',
        },
    },
};

export default meta;

type Story = StoryObj<typeof Container>;

export const Standard: Story = {
    render: () => (
        <Container>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                Innhold i container
            </div>
        </Container>
    ),
};
