import type { Meta, StoryObj } from '@storybook/react';
import { SaunaMap } from './SaunaMap';
import readme from './SaunaMap.README.md?raw';

const meta: Meta<typeof SaunaMap> = {
    title: 'Komponenter/Badstue/SaunaMap',
    component: SaunaMap,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: readme,
            },
        },
        layout: 'padded',
    },
    argTypes: {
        address: {
            control: 'text',
            description: 'Adresse som vises over kartet.',
        },
        mapEmbedUrl: {
            control: 'text',
            description: 'URL til kart-iframe.',
        },
        saunaName: {
            control: 'text',
            description: 'Brukes i iframe-tittel.',
        },
    },
    args: {
        address: 'Nedre Langgate 44, 3126 Tønsberg',
        saunaName: 'Tønsberg Brygge',
        mapEmbedUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=10.4085%2C59.2669%2C10.4208%2C59.2747&layer=mapnik',
    },
};

export default meta;

type Story = StoryObj<typeof SaunaMap>;

export const Standard: Story = {};

