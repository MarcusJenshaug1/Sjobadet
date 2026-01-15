import type { Meta, StoryObj } from '@storybook/react';
import { MediaItem } from './MediaItem';

const meta: Meta<typeof MediaItem> = {
    title: 'Components/Admin/MediaItem',
    component: MediaItem,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MediaItem>;

export const Confirmed: Story = {
    args: {
        asset: {
            id: '1',
            url: 'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_7224.jpg?etag=null&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=685%2B514&extract=151%2B0%2B514%2B514&quality=85',
            status: 'confirmed'
        },
        onDelete: (id) => console.log('Delete', id)
    },
};

export const Uploading: Story = {
    args: {
        asset: {
            id: '2',
            url: 'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_7224.jpg?etag=null&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=685%2B514&extract=151%2B0%2B514%2B514&quality=85',
            status: 'uploading',
            progress: 45
        },
        onDelete: (id) => console.log('Delete', id)
    },
};

export const Processing: Story = {
    args: {
        asset: {
            id: '3',
            url: 'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_7224.jpg?etag=null&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=685%2B514&extract=151%2B0%2B514%2B514&quality=85',
            status: 'processing'
        },
        onDelete: (id) => console.log('Delete', id)
    },
};

export const Error: Story = {
    args: {
        asset: {
            id: '4',
            url: 'https://impro.usercontent.one/appid/uniwebWsb/domain/sjobadet.net/media/sjobadet.net/onewebmedia/IMG_7224.jpg?etag=null&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=685%2B514&extract=151%2B0%2B514%2B514&quality=85',
            status: 'error',
            error: 'Filen er for stor'
        },
        onDelete: (id) => console.log('Delete', id)
    },
};
