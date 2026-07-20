import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, waitFor, within } from 'storybook/test';
import { Provider } from 'react-redux';
import { HttpResponse, http } from 'msw';
import { getStore } from '../../utilities/store';
import { IntegrationsWidget } from './IntegrationsWidget';
import { KesselRbacAccessContext } from '../../rbac/KesselRbacAccessContext';

const kesselContextValue = {
  workspaceId: 'mock-workspace-id',
  isLoading: false,
  permissions: {
    canWriteIntegrationsEndpoints: true,
    canReadIntegrationsEndpoints: true,
  },
  errors: [],
};

const createMockStore = (overrides: { user?: Record<string, unknown> } = {}) => {
  const initialState = {
    sources: {
      entities: [],
      loaded: 0,
      sourceTypesLoaded: true,
      appTypesLoaded: true,
      numberOfEntities: 0,
      pageNumber: 1,
      pageSize: 50,
      activeCategory: null,
    },
    user: {
      isOrgAdmin: true,
      writePermissions: true,
      integrationsEndpointsPermissions: true,
      integrationsReadPermissions: true,
      ...overrides.user,
    },
  };

  return getStore([], initialState);
};

const graphqlHandler = (cloudSources: unknown[], redHatSources: unknown[]) =>
  http.post('/api/sources/v3.1/graphql', async ({ request }) => {
    const body = (await request.json()) as { query: string };
    if (body.query.includes('Cloud')) {
      return HttpResponse.json({
        data: {
          sources: cloudSources,
          meta: { count: cloudSources.length },
        },
      });
    }

    return HttpResponse.json({
      data: {
        sources: redHatSources,
        meta: { count: redHatSources.length },
      },
    });
  });

const integrationsHandler = (integrations: { type: string; sub_type?: string }[]) =>
  http.get('/api/integrations/v1.0/endpoints', () => HttpResponse.json({ data: integrations }));

const rbacHandler = http.get('/api/rbac/v2/workspaces', () =>
  HttpResponse.json({ data: [{ id: 'mock-workspace-id', type: 'default', name: 'Default' }] }),
);

const emptyHandlers = [graphqlHandler([], []), integrationsHandler([]), rbacHandler];

const populatedCloudSources = [
  { id: '1', source_type_id: '1', name: 'AWS Prod', created_at: '2024-01-01', availability_status: 'available' },
  { id: '2', source_type_id: '1', name: 'AWS Dev', created_at: '2024-01-02', availability_status: 'available' },
  { id: '3', source_type_id: '3', name: 'Azure Prod', created_at: '2024-01-03', availability_status: 'available' },
];

const populatedRedHatSources = [
  { id: '10', source_type_id: '1', name: 'OpenShift Prod', created_at: '2024-01-01', availability_status: 'available' },
];

const populatedIntegrations = [
  { type: 'camel', sub_type: 'slack' },
  { type: 'camel', sub_type: 'slack' },
  { type: 'camel', sub_type: 'google_chat' },
  { type: 'ansible' },
  { type: 'ansible' },
  { type: 'ansible' },
  { type: 'webhook' },
];

const populatedHandlers = [
  graphqlHandler(populatedCloudSources, populatedRedHatSources),
  integrationsHandler(populatedIntegrations),
  rbacHandler,
];

const meta: Meta<typeof IntegrationsWidget> = {
  component: IntegrationsWidget,
  title: 'Components/Widget/IntegrationsWidget',
  decorators: [
    (Story, context) => {
      const store = createMockStore(context.parameters.storeOverrides);
      return (
        <Provider store={store}>
          <KesselRbacAccessContext.Provider value={kesselContextValue}>
            <Story />
          </KesselRbacAccessContext.Provider>
        </Provider>
      );
    },
  ],
  parameters: {
    featureFlags: {
      'platform.integrations.pager-duty': false,
      'platform.notifications.email.integration': false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof IntegrationsWidget>;

export const EmptyState: Story = {
  parameters: {
    msw: { handlers: emptyHandlers },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Shows empty state card gallery', async () => {
      await waitFor(() => expect(canvas.getByText('Learn more about Integrations.')).toBeInTheDocument());
    });

    await step('Renders integration tiles', async () => {
      await waitFor(() => {
        expect(canvas.getByText('Slack')).toBeInTheDocument();
        expect(canvas.getByText('Amazon Web Services')).toBeInTheDocument();
        expect(canvas.getByText('Google Cloud')).toBeInTheDocument();
        expect(canvas.getByText('Microsoft Azure')).toBeInTheDocument();
        expect(canvas.getByText('OpenShift Container Platform')).toBeInTheDocument();
        expect(canvas.getByText('Event-Driven Ansible')).toBeInTheDocument();
        expect(canvas.getByText('Webhooks')).toBeInTheDocument();
      });
    });
  },
};

export const WithIntegrations: Story = {
  parameters: {
    msw: { handlers: populatedHandlers },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Shows DataList with category rows', async () => {
      await waitFor(() => {
        expect(canvas.getByText('Communications')).toBeInTheDocument();
        expect(canvas.getByText('Reporting & automation')).toBeInTheDocument();
        expect(canvas.getByText('Webhooks')).toBeInTheDocument();
        expect(canvas.getByText('Cloud')).toBeInTheDocument();
        expect(canvas.getByText('Red Hat')).toBeInTheDocument();
      });
    });

    await step('Shows correct badge counts', async () => {
      await waitFor(() => {
        const badges = canvas.getAllByText(/^\d+$/);
        expect(badges.length).toBeGreaterThan(0);
      });
    });

    await step('Shows Manage buttons', async () => {
      await waitFor(() => {
        const manageButtons = canvas.getAllByText('Manage');
        expect(manageButtons.length).toBe(5);
      });
    });
  },
};

export const WithAllFlags: Story = {
  parameters: {
    msw: { handlers: emptyHandlers },
    featureFlags: {
      'platform.integrations.pager-duty': true,
      'platform.notifications.email.integration': true,
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Shows PagerDuty tile when flag is enabled', async () => {
      await waitFor(() => expect(canvas.getByText('PagerDuty')).toBeInTheDocument());
    });

    await step('Shows Email tile when flag is enabled', async () => {
      await waitFor(() => expect(canvas.getByText('Email')).toBeInTheDocument());
    });
  },
};
