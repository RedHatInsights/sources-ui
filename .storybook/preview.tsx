import type { Preview } from '@storybook/react-webpack5';
import '@patternfly/react-core/dist/styles/base.css';
import '@redhat-cloud-services/hcc-storybook-hub/css/storybook.css';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
import { getProdStore } from '../src/utilities/store';
import {
  type FeatureFlagsConfig,
  FeatureFlagsProvider,
  StorybookMockProvider,
  chromeSpies,
} from '@redhat-cloud-services/hcc-storybook-hub';
import { initialize, mswLoader } from 'msw-storybook-addon';

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
    chrome: {
      environment: 'prod',
    },
    featureFlags: {},
  },
  decorators: [
    (Story, { parameters, args }) => {
      chromeSpies.get('appNavClick')?.mockClear();

      const environment = args.environment ?? parameters.chrome?.environment ?? 'production';

      const featureFlags: FeatureFlagsConfig = {
        ...parameters.featureFlags,
      };

      return (
        <Provider store={storybookStore}>
          <IntlProvider locale="en">
            <StorybookMockProvider
              bundle="sources"
              app="sources"
              environment={environment}
              isOrgAdmin
              permissions={['sources:*:*']}
            >
              <FeatureFlagsProvider value={featureFlags}>
                <MemoryRouter>
                  <NotificationsProvider>
                    <Story />
                  </NotificationsProvider>
                </MemoryRouter>
              </FeatureFlagsProvider>
            </StorybookMockProvider>
          </IntlProvider>
        </Provider>
      );
    },
  ],
};

export default preview;
