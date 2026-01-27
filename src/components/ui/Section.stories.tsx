import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';
import readme from './Section.README.md?raw';

const meta: Meta<typeof Section> = {
    title: 'Komponenter/Layout/Section',
    component: Section,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Vertikal spacing rundt seksjonen.',
        },
        as: {
            control: 'text',
            description: 'Semantisk element (f.eks. `section`).',
        },
    },
    args: {
        size: 'md',
    },
};

export default meta;

type Story = StoryObj<typeof Section>;

export const Standard: Story = {
    render: () => (
        <Section>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                Seksjonsinnhold
            </div>
        </Section>
    ),
};

export const Størrelser: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '1rem' }}>
            <Section size="sm">
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    Liten seksjon
                </div>
            </Section>
            <Section size="md">
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    Standard seksjon
                </div>
            </Section>
            <Section size="lg">
                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    Stor seksjon
                </div>
            </Section>
        </div>
    ),
};
