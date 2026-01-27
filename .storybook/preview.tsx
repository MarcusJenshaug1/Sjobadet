import React from 'react';
import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css';
import theme from './theme';
import { HeaderView } from '../src/components/layout/HeaderView';
import { FooterView } from '../src/components/layout/FooterView';
import { AlertBarView } from '../src/components/layout/AlertBarView';
import { TrackingProvider } from '../src/components/analytics/TrackingProvider';
import { ScrollToTop } from '../src/components/layout/ScrollToTop';
import { SmartPrefetcher } from '../src/components/layout/SmartPrefetcher';
import { ErrorBoundary } from '../src/components/layout/ErrorBoundary';

const saunaLinks = [
  { label: 'Tønsberg Brygge', href: '/home/tonsberg-brygge', views: 120 },
  { label: 'Hjemseng brygge', href: '/home/hjemseng-brygge', views: 80 },
  { label: 'Badstuehengeren', href: '/home/hjem', views: 20 },
];

const infoLinks = [
  { label: 'Åpningstider', href: '/info/apningstider', views: 40 },
  { label: 'Om oss', href: '/info/om-oss', views: 35 },
  { label: 'Ofte stilte spørsmål', href: '/info/faq', views: 30 },
  { label: 'Badstueregler', href: '/info/regler', views: 25 },
  { label: 'Salgsbetingelser', href: '/info/vilkar', views: 15 },
  { label: 'Bedriftsmedlemskap', href: '/bedrift', views: 10 },
];

const preview: Preview = {
  globalTypes: {
    sjobadetChrome: {
      name: 'Sjøbadet chrome',
      description: 'Vis header/footer i preview',
      defaultValue: 'off',
      toolbar: {
        icon: 'menu',
        items: [
          { value: 'auto', title: 'Auto (kun Docs)' },
          { value: 'on', title: 'På' },
          { value: 'off', title: 'Av' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const chromeSetting = context.globals?.sjobadetChrome ?? 'auto';
      const chromeFromParams = context.parameters?.sjobadetChrome;
      const chromeEnabled = chromeFromParams === true
        ? true
        : chromeFromParams === false
          ? false
          : chromeSetting === 'on'
            ? true
            : chromeSetting === 'off'
              ? false
              : context.viewMode === 'docs';

      if (!chromeEnabled) {
        return (
          <div style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
            <Story />
          </div>
        );
      }

      return (
        <ErrorBoundary>
          <TrackingProvider isAdmin={false}>
            <ScrollToTop />
            <SmartPrefetcher />
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', color: 'var(--foreground)' }}>
              <AlertBarView alert_enabled={false} alert_text="" />
              <HeaderView isAdmin={false} saunaLinks={saunaLinks} infoLinks={infoLinks} />
              <main className="section" style={{ flex: 1 }}>
                <div className="container">
                  <Story />
                </div>
              </main>
              <FooterView
                address="Nedre Langgate 44, 3126 Tønsberg"
                email="booking@sjobadet.com"
                phone="+47 401 55 365"
                instagram="https://www.instagram.com/sjobadet_badstue/"
                facebook="https://www.facebook.com/Sjobadetbadstue"
                saunas={[
                  {
                    id: '1',
                    slug: 'tonsberg-brygge',
                    name: 'Tønsberg Brygge',
                    location: 'Tønsberg',
                    shortDescription: 'Badstue ved brygga',
                    capacityDropin: 8,
                    capacityPrivat: 10,
                    driftStatus: 'open',
                    flexibleHours: false,
                  },
                  {
                    id: '2',
                    slug: 'hjemseng-brygge',
                    name: 'Hjemseng brygge',
                    location: 'Hjemseng',
                    shortDescription: 'Badstue ved sjøen',
                    capacityDropin: 6,
                    capacityPrivat: 10,
                    driftStatus: 'open',
                    flexibleHours: false,
                  },
                ]}
              />
            </div>
          </TrackingProvider>
        </ErrorBoundary>
      );
    }
  ],
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
    layout: 'fullscreen',
    options: {
      storySort: {
        order: ['Forside', 'Grunnlag', ['Farger', 'Flater', 'Typografi'], 'Komponenter'],
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
