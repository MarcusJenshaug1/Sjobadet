import { create } from 'storybook/theming';

export default create({
    base: 'light',
    brandTitle: 'Sjøbadet Design System',
    brandUrl: '/admin',
    brandImage: '/storybook/sjobadet-logo.png',
    brandTarget: '_self',

    // Typography
    fontBase: '"Inter", sans-serif',
    fontCode: 'monospace',

    // Colors
    colorPrimary: '#5a7d7d',
    colorSecondary: '#4a6d6d',

    // UI
    appBg: '#f0f4f4',
    appContentBg: '#ffffff',
    appBorderColor: '#e0e0e0',
    appBorderRadius: 8,

    // Text colors
    textColor: '#3c3c3c',
    textInverseColor: '#ffffff',

    // Toolbar default and active colors
    barTextColor: '#3c3c3c',
    barSelectedColor: '#5a7d7d',
    barBg: '#ffffff',
});
