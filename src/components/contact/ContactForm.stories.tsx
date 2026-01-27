import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ContactForm } from './ContactForm';
import readme from './ContactForm.README.md?raw';

const meta: Meta<typeof ContactForm> = {
    title: 'Komponenter/Skjema/ContactForm',
    component: ContactForm,
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

type Story = StoryObj<typeof ContactForm>;

export const Standard: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.type(canvas.getByLabelText('Navn'), 'Ola Nordmann');
        await userEvent.type(canvas.getByLabelText('E-post'), 'ola@example.com');
        await userEvent.type(canvas.getByLabelText('Emne'), 'Spørsmål');
        await userEvent.type(canvas.getByLabelText('Melding'), 'Hei!');
        await expect(canvas.getByRole('button', { name: /Send melding/i })).toBeEnabled();
    },
};

export const EtterInnsending: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.type(canvas.getByLabelText('Navn'), 'Ola Nordmann');
        await userEvent.type(canvas.getByLabelText('E-post'), 'ola@example.com');
        await userEvent.type(canvas.getByLabelText('Emne'), 'Spørsmål');
        await userEvent.type(canvas.getByLabelText('Melding'), 'Hei!');
        await userEvent.click(canvas.getByRole('button', { name: /Send melding/i }));
        await new Promise((resolve) => setTimeout(resolve, 1600));
        await expect(canvas.getByRole('button', { name: 'Send ny melding' })).toBeInTheDocument();
    },
};
