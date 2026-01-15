import type { Meta, StoryObj } from '@storybook/react';
import { SaunaGallery } from './SaunaGallery';

const meta: Meta<typeof SaunaGallery> = {
    title: 'Components/Sauna/SaunaGallery',
    component: SaunaGallery,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SaunaGallery>;

export const Default: Story = {
    args: {
        saunaName: 'Tønsberg Brygge',
        images: [
            'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_7224.jpg?etag=null&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=685%2B514&extract=151%2B0%2B514%2B514&quality=85',
            'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_3888.jpeg?etag=undefined&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=607%2B455&extract=0%2B0%2B546%2B417&quality=85',
            'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/Skjermbilde%202025-11-18%20kl.%2010.39.23.png?etag=undefined&sourceContentType=image%2Fpng&ignoreAspectRatio&resize=969%2B514&extract=147%2B0%2B713%2B514&quality=85'
        ]
    },
};
