import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea } from './Textarea';
import readme from './Textarea.README.md?raw';

const meta: Meta<typeof Textarea> = {
    title: 'Komponenter/Skjema/Textarea',
    component: Textarea,
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
        rows: {
            control: 'number',
            description: 'Antall synlige linjer.',
        },
        placeholder: {
            control: 'text',
            description: 'Hjelpetekst når feltet er tomt.',
        },
        disabled: {
            control: 'boolean',
            description: 'Deaktiverer feltet.',
        },
        onChange: {
            action: 'changed',
            description: 'Kalles ved endring av verdi.',
        },
    },
    args: {
        size: 'md',
        rows: 4,
        placeholder: 'Skriv en melding…',
    },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Standard: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const textarea = canvas.getByPlaceholderText('Skriv en melding…');
        await userEvent.type(textarea, 'Hei');
        await expect(textarea).toHaveValue('Hei');
    },
};

export const Størrelser: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 420 }}>
            <Textarea size="sm" rows={3} placeholder="Liten" />
            <Textarea size="md" rows={4} placeholder="Standard" />
            <Textarea size="lg" rows={5} placeholder="Stor" />
        </div>
    ),
};

export const Tilstander: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 420 }}>
            <Textarea rows={3} placeholder="Normal" />
            <Textarea rows={3} placeholder="Deaktivert" disabled />
            <Textarea rows={3} readOnly value="Låst verdi" />
        </div>
    ),
};

export const Feiltilstand: Story = {
    render: () => (
        <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 420 }}>
            <label htmlFor="melding-feil">Melding</label>
            <Textarea
                id="melding-feil"
                rows={4}
                placeholder="Skriv en kort melding"
                aria-invalid="true"
                aria-describedby="melding-feil-hjelp"
            />
            <small id="melding-feil-hjelp" style={{ color: '#b42318' }}>
                Meldingen må være minst 20 tegn.
            </small>
        </div>
    ),
};
