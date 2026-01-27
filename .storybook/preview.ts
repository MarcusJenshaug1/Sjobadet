import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css';
import theme from './theme';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'base',
      values: [
        { name: 'base', value: '#ffffff' },
        { name: 'soft', value: '#F0F4F4' },
        { name: 'dark', value: '#1E1E1E' }
      ],
    },
    docs: {
      theme,
    },
    layout: 'padded',
    options: {
      storySort: {
        order: ['Grunnlag', ['Farger', 'Flater', 'Typografi'], 'Komponenter'],
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  tags: ['autodocs']
};

export default preview;