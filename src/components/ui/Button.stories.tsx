import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'Components/UI/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'Bestill nå',
        variant: 'primary',
    },
};

export const Secondary: Story = {
    args: {
        children: 'Les mer',
        variant: 'secondary',
    },
};

export const Outline: Story = {
    args: {
        children: 'Min Side',
        variant: 'outline',
    },
};

export const Large: Story = {
    args: {
        children: 'Kjøp gavekort',
        size: 'lg',
    },
};

export const Small: Story = {
    args: {
        children: 'Fjern',
        size: 'sm',
        variant: 'outline',
    },
};

export const Danger: Story = {
    args: {
        children: 'Slett badstue',
        variant: 'danger',
    },
};
