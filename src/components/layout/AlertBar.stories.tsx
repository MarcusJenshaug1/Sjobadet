import type { Meta, StoryObj } from '@storybook/react';
import { AlertBarView } from './AlertBarView';
import readme from './AlertBar.README.md?raw';

const meta: Meta<typeof AlertBarView> = {
    title: 'Komponenter/Layout/AlertBar',
    component: AlertBarView,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
    },
    argTypes: {
        alert_enabled: {
            control: 'boolean',
            description: 'Viser eller skjuler varselet.',
        },
        alert_text: {
            control: 'text',
            description: 'Tekstinnholdet i varselet.',
        },
    },
};

export default meta;
type Story = StoryObj<typeof AlertBarView>;

export const Standard: Story = {
    args: {
        alert_enabled: true,
        alert_text: 'Vi holder stengt for vedlikehold på mandag.',
    },
};

export const LongText: Story = {
    args: {
        alert_enabled: true,
        alert_text: 'Viktig melding: Vi har nå åpnet for booking av sesongkort for 2026! Sikre deg din plass i dag for å nyte badstukulturen hele året.',
    },
};
