import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import './storybook.css';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { getProdStore } from '../src/utilities/store';
import {
  type ChromeConfig,
  ChromeProvider,
  type FeatureFlagsConfig,
  FeatureFlagsProvider,
  resetChromeAppNavClickSpy,
  resetFlagsStatus,
} from './context-providers';
import { initialize, mswLoader } from 'msw-storybook-addon';

// Mock insights global for Storybook
declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var insights: {
    chrome: {
      getEnvironment: () => string;
    };
  };
}

// Mock global insights object for libraries that access it directly
const mockInsightsChrome = {
  getEnvironment: () => 'prod',
  getUserPermissions: () => Promise.resolve([{ permission: 'sources:*:*', resourceDefinitions: [] }]),
  auth: {
    getUser: () =>
      Promise.resolve({
        identity: {
          user: {
            username: 'test-user',
            email: 'test@redhat.com',
            is_org_admin: true,
            is_internal: false,
          },
        },
      }),
    getToken: () => Promise.resolve('mock-jwt-token-12345'),
  },
};

if (typeof global !== 'undefined') {
  (global as typeof globalThis).insights = { chrome: mockInsightsChrome };
} else if (typeof window !== 'undefined') {
  (window as typeof globalThis).insights = { chrome: mockInsightsChrome };
}

// Create a single store instance for all stories to avoid recreation
const storybookStore = getProdStore();

const preview: Preview = {
  beforeAll: async () => {
    initialize({ onUnhandledRequest: 'warn' });
  },
  loaders: [mswLoader],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Documentation', 'Components', '*'],
      },
    },
    layout: 'fullscreen',
    chromatic: { delay: 300 },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Default configurations for all stories (can be overridden per story)
    chrome: {
      environment: 'prod',
    },
    featureFlags: {},
  },
  decorators: [
    (Story, { parameters, args }) => {
      // Reset spy history and flags status before each story render
      resetChromeAppNavClickSpy();
      resetFlagsStatus();

      // Merge chrome config from parameters with any arg overrides
      const chromeConfig: ChromeConfig = {
        environment: 'prod',
        ...parameters.chrome,
        ...(args.environment !== undefined && { environment: args.environment }),
      };

      const featureFlags: FeatureFlagsConfig = {
        ...parameters.featureFlags,
      };

      return (
        <Provider store={storybookStore}>
          <IntlProvider locale="en">
            <ChromeProvider value={chromeConfig}>
              <FeatureFlagsProvider value={featureFlags}>
                <MemoryRouter>
                  <NotificationsProvider>
                    <Story />
                  </NotificationsProvider>
                </MemoryRouter>
              </FeatureFlagsProvider>
            </ChromeProvider>
          </IntlProvider>
        </Provider>
      );
    },
  ],
};

export default preview;
