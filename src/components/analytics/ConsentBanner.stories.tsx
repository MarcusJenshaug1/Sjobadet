import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ConsentBanner } from './ConsentBanner';
import readme from './ConsentBanner.README.md?raw';

const clearConsentCookie = () => {
    if (typeof document === 'undefined') return;
    document.cookie = 'sjobadet_consent=; path=/; max-age=0; samesite=lax';
};

const ConsentBannerWithReset = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        clearConsentCookie();
        setReady(true);
    }, []);

    if (!ready) return null;
    return <ConsentBanner />;
};

const meta: Meta<typeof ConsentBanner> = {
    title: 'Komponenter/Analyse/ConsentBanner',
    component: ConsentBanner,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: readme,
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof ConsentBanner>;

export const Standard: Story = {
    render: () => <ConsentBannerWithReset />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const button = await canvas.findByRole('button', { name: 'Tilpass' });
        await expect(button).toBeInTheDocument();
    },
};

export const Dialog: Story = {
    render: () => <ConsentBannerWithReset />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(await canvas.findByRole('button', { name: 'Tilpass' }));
        await expect(canvas.getByRole('heading', { name: 'Innstillinger for infokapsler' })).toBeInTheDocument();
    },
};
