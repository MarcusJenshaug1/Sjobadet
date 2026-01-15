import { create } from '@storybook/theming/create';

export default create({
    base: 'light',
    brandTitle: 'Sjøbadet Design System',
    brandUrl: 'https://sjobadet.net',
    brandImage: '', // Option to add logo later
    brandTarget: '_self',

    // Typography
    fontBase: '"Inter", sans-serif',
    fontCode: 'monospace',

    // Colors
    colorPrimary: '#719898', // Havgrønn
    colorSecondary: '#5a7d7d',

    // UI
    appBg: '#F0F4F4',
    appContentBg: '#ffffff',
    appBorderColor: '#E0E0E0',
    appBorderRadius: 8,

    // Text colors
    textColor: '#3C3C3C',
    textInverseColor: '#ffffff',

    // Toolbar default and active colors
    barTextColor: '#3C3C3C',
    barSelectedColor: '#719898',
    barBg: '#ffffff',
});
