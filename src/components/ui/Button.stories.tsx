import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import readme from './Button.README.md?raw';

const meta: Meta<typeof Button> = {
    title: 'Komponenter/Knapper/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
            description: 'Visuell variant som kommuniserer prioritet og risiko.',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Størrelse på knappens padding og tekst.',
        },
        fullWidth: {
            control: 'boolean',
            description: 'Strekker knappen til full bredde i containeren.',
        },
        href: {
            control: 'text',
            description: 'Gjør knappen til lenke når den er satt.',
        },
        external: {
            control: 'boolean',
            description: 'Åpner lenker i ny fane når `href` er satt.',
        },
        onClick: {
            action: 'clicked',
            description: 'Klikkhandler for knappen.',
        },
    },
    args: {
        children: 'Bestill nå',
        variant: 'primary',
        size: 'md',
        fullWidth: false,
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Standard: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole('button', { name: 'Bestill nå' });
        await userEvent.click(button);
        await expect(button).toBeEnabled();
    },
};

export const Varianter: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Bestill</Button>
            <Button variant="secondary">Les mer</Button>
            <Button variant="outline">Min side</Button>
            <Button variant="ghost">Utforsk</Button>
            <Button variant="danger">Slett</Button>
        </div>
    ),
};

export const Størrelser: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button size="sm">Liten</Button>
            <Button size="md">Standard</Button>
            <Button size="lg">Stor</Button>
        </div>
    ),
};

export const Tilstander: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button>Normal</Button>
            <Button disabled>Deaktivert</Button>
            <Button variant="outline" id="fokus-knapp">Fokus</Button>
        </div>
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const focusButton = canvas.getByRole('button', { name: 'Fokus' });
        focusButton.focus();
        await expect(focusButton).toHaveFocus();
    },
};

export const Lenke: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button href="/medlemskap">Medlemskap</Button>
            <Button href="https://sjobadet.net" external variant="outline">
                Gå til sjobadet.net
            </Button>
        </div>
    ),
};
