import type { Meta, StoryObj } from '@storybook/react';
import { AlertBarView } from './AlertBar';

const meta: Meta<typeof AlertBarView> = {
    title: 'Components/Layout/AlertBar',
    component: AlertBarView,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AlertBarView>;

export const Default: Story = {
    args: {
        alert_enabled: true,
        alert_text: '⚠️ Vi holder stengt for vedlikehold på mandag.',
    },
};

export const LongText: Story = {
    args: {
        alert_enabled: true,
        alert_text: 'Viktig melding: Vi har nå åpnet for booking av sesongkort for 2026! Sikre deg din plass i dag for å nyte badstukulturen hele året.',
    },
};
