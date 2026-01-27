import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'node:path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ],
  "docs": {
    "autodocs": true
  },
  async viteFinal(config) {
    const root = process.cwd();
    const existingAlias = config.resolve?.alias ?? [];
    const navigationAlias = {
      find: 'next/navigation',
      replacement: path.resolve(root, '.storybook/next-navigation.mock.ts')
    };
    const navigationAliasJs = {
      find: 'next/navigation.js',
      replacement: path.resolve(root, '.storybook/next-navigation.mock.ts')
    };
    const navigationAliasMjs = {
      find: 'next/navigation.mjs',
      replacement: path.resolve(root, '.storybook/next-navigation.mock.ts')
    };
    const redirectStatusAlias = {
      find: 'next/dist/client/components/redirect-status-code',
      replacement: path.resolve(root, '.storybook/next-redirect-status-code.mock.ts')
    };
    const redirectStatusAliasJs = {
      find: 'next/dist/client/components/redirect-status-code.js',
      replacement: path.resolve(root, '.storybook/next-redirect-status-code.mock.ts')
    };
    const redirectStatusAliasMjs = {
      find: 'next/dist/client/components/redirect-status-code.mjs',
      replacement: path.resolve(root, '.storybook/next-redirect-status-code.mock.ts')
    };
    const redirectAlias = {
      find: 'next/dist/client/components/redirect',
      replacement: path.resolve(root, '.storybook/next-redirect.mock.ts')
    };
    const redirectAliasJs = {
      find: 'next/dist/client/components/redirect.js',
      replacement: path.resolve(root, '.storybook/next-redirect.mock.ts')
    };
    const redirectAliasMjs = {
      find: 'next/dist/client/components/redirect.mjs',
      replacement: path.resolve(root, '.storybook/next-redirect.mock.ts')
    };
    const navigationClientAlias = {
      find: 'next/dist/client/components/navigation',
      replacement: path.resolve(root, '.storybook/next-navigation-client.mock.ts')
    };
    const navigationClientAliasJs = {
      find: 'next/dist/client/components/navigation.js',
      replacement: path.resolve(root, '.storybook/next-navigation-client.mock.ts')
    };
    const navigationClientAliasMjs = {
      find: 'next/dist/client/components/navigation.mjs',
      replacement: path.resolve(root, '.storybook/next-navigation-client.mock.ts')
    };
    const alias = Array.isArray(existingAlias)
      ? [
          navigationAlias,
          navigationAliasJs,
          navigationAliasMjs,
          redirectStatusAlias,
          redirectStatusAliasJs,
          redirectStatusAliasMjs,
          redirectAlias,
          redirectAliasJs,
          redirectAliasMjs,
          navigationClientAlias,
          navigationClientAliasJs,
          navigationClientAliasMjs,
          ...existingAlias
        ]
      : {
          ...existingAlias,
          'next/navigation': navigationAlias.replacement,
          'next/navigation.js': navigationAlias.replacement,
          'next/navigation.mjs': navigationAlias.replacement,
          'next/dist/client/components/redirect-status-code': redirectStatusAlias.replacement,
          'next/dist/client/components/redirect-status-code.js': redirectStatusAlias.replacement,
          'next/dist/client/components/redirect-status-code.mjs': redirectStatusAlias.replacement,
          'next/dist/client/components/redirect': redirectAlias.replacement,
          'next/dist/client/components/redirect.js': redirectAlias.replacement,
          'next/dist/client/components/redirect.mjs': redirectAlias.replacement,
          'next/dist/client/components/navigation': navigationClientAlias.replacement,
          'next/dist/client/components/navigation.js': navigationClientAlias.replacement,
          'next/dist/client/components/navigation.mjs': navigationClientAlias.replacement,
        };
    return {
      ...config,
      optimizeDeps: {
        ...(config.optimizeDeps ?? {}),
        exclude: [
          ...(config.optimizeDeps?.exclude ?? []),
          'next/navigation',
          'next/navigation.js',
          'next/navigation.mjs',
          'next/dist/client/components/redirect-status-code',
          'next/dist/client/components/redirect-status-code.js',
          'next/dist/client/components/redirect-status-code.mjs',
          'next/dist/client/components/redirect',
          'next/dist/client/components/redirect.js',
          'next/dist/client/components/redirect.mjs',
          'next/dist/client/components/navigation',
          'next/dist/client/components/navigation.js',
          'next/dist/client/components/navigation.mjs'
        ]
      },
      resolve: {
        ...(config.resolve ?? {}),
        alias,
      },
    };
  }
};
export default config;