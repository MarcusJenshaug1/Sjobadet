import type { Meta, StoryObj } from '@storybook/react';
import { CookieSettingsTrigger } from './CookieSettingsTrigger';
import readme from './CookieSettingsTrigger.README.md?raw';

const meta: Meta<typeof CookieSettingsTrigger> = {
    title: 'Komponenter/Layout/CookieSettingsTrigger',
    component: CookieSettingsTrigger,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        label: {
            control: 'text',
            description: 'Tekst for knappen.',
        },
    },
    args: {
        label: 'Personvernvalg',
    },
};

export default meta;

type Story = StoryObj<typeof CookieSettingsTrigger>;

export const Standard: Story = {};
