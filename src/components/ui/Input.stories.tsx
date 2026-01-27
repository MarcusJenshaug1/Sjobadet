import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './Input';
import readme from './Input.README.md?raw';

const meta: Meta<typeof Input> = {
    title: 'Komponenter/Skjema/Input',
    component: Input,
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
            description: 'Størrelse på feltets padding og tekst.',
        },
        type: {
            control: 'text',
            description: 'HTML-inputtype, f.eks. `text` eller `email`.',
        },
        placeholder: {
            control: 'text',
            description: 'Hjelpetekst når feltet er tomt.',
        },
        disabled: {
            control: 'boolean',
            description: 'Deaktiverer feltet.',
        },
        required: {
            control: 'boolean',
            description: 'Markerer feltet som påkrevd i skjema.',
        },
        onChange: {
            action: 'changed',
            description: 'Kalles ved endring av verdi.',
        },
    },
    args: {
        size: 'md',
        placeholder: 'Skriv her…',
    },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Standard: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const input = canvas.getByPlaceholderText('Skriv her…');
        await userEvent.type(input, 'Test');
        await expect(input).toHaveValue('Test');
    },
};

export const Størrelser: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 360 }}>
            <Input size="sm" placeholder="Liten" />
            <Input size="md" placeholder="Standard" />
            <Input size="lg" placeholder="Stor" />
        </div>
    ),
};

export const Tilstander: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 360 }}>
            <Input placeholder="Normal" />
            <Input placeholder="Deaktivert" disabled />
            <Input placeholder="Kun lesing" readOnly value="Låst verdi" />
        </div>
    ),
};

export const Feiltilstand: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 360 }}>
            <label htmlFor="email-feil">E-post</label>
            <Input
                id="email-feil"
                type="email"
                placeholder="navn@domene.no"
                aria-invalid="true"
                aria-describedby="email-feil-hjelp"
            />
            <small id="email-feil-hjelp" style={{ color: '#b42318' }}>
                Ugyldig e-postadresse.
            </small>
        </div>
    ),
};
