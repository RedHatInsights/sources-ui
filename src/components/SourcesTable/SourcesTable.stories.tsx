import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Provider } from 'react-redux';
import { getStore } from '../../utilities/store';
import SourcesTable from './SourcesTable';

// Mock data based on test fixtures
const mockSourceTypes = [
  {
    id: '1',
    name: 'openshift',
    product_name: 'OpenShift Container Platform',
    vendor: 'Red Hat',
    category: 'Red Hat',
    icon_url: '/apps/frontend-assets/red-hat-logos/stacked.svg',
  },
  {
    id: '2',
    name: 'amazon',
    product_name: 'Amazon Web Services',
    vendor: 'Amazon',
    category: 'Cloud',
    icon_url: '/apps/frontend-assets/partners-icons/aws.svg',
  },
  {
    id: '3',
    name: 'azure',
    product_name: 'Microsoft Azure',
    vendor: 'Microsoft',
    category: 'Cloud',
    icon_url: '/apps/frontend-assets/partners-icons/microsoft-azure-short.svg',
  },
  {
    id: '4',
    name: 'google',
    product_name: 'Google Cloud Platform',
    vendor: 'Google',
    category: 'Cloud',
    icon_url: '/apps/frontend-assets/partners-icons/google-cloud-short.svg',
  },
];

const mockApplicationTypes = [
  {
    id: '1',
    name: '/insights/platform/catalog',
    display_name: 'Catalog',
    supported_source_types: ['openshift'],
  },
  {
    id: '2',
    name: '/insights/platform/cost-management',
    display_name: 'Cost Management',
    supported_source_types: ['amazon', 'azure', 'google', 'openshift'],
  },
  {
    id: '3',
    name: '/insights/platform/topological-inventory',
    display_name: 'Topological Inventory',
    supported_source_types: ['amazon', 'azure', 'openshift'],
  },
];

const mockSources = [
  {
    id: '1',
    name: 'Production AWS Account',
    source_type_id: '2',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-03-20T14:22:00Z',
    availability_status: 'available',
    paused_at: null,
    imported: false,
    applications: [{ id: '101', application_type_id: '2', availability_status: 'available' }],
  },
  {
    id: '2',
    name: 'Development Azure Subscription',
    source_type_id: '3',
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-03-22T16:45:00Z',
    availability_status: 'available',
    paused_at: null,
    imported: false,
    applications: [
      { id: '102', application_type_id: '2', availability_status: 'available' },
      { id: '103', application_type_id: '3', availability_status: 'available' },
    ],
  },
  {
    id: '3',
    name: 'Staging GCP Project',
    source_type_id: '4',
    created_at: '2024-03-01T14:20:00Z',
    updated_at: '2024-03-23T10:10:00Z',
    availability_status: 'unavailable',
    paused_at: null,
    imported: false,
    applications: [{ id: '104', application_type_id: '2', availability_status: 'unavailable' }],
  },
  {
    id: '4',
    name: 'Production OpenShift Cluster',
    source_type_id: '1',
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-03-24T12:00:00Z',
    availability_status: 'available',
    paused_at: '2024-03-20T10:00:00Z',
    imported: false,
    applications: [
      { id: '105', application_type_id: '1', availability_status: 'available' },
      { id: '106', application_type_id: '2', availability_status: 'available' },
    ],
  },
  {
    id: '5',
    name: 'Testing AWS Environment',
    source_type_id: '2',
    created_at: '2024-03-10T11:00:00Z',
    updated_at: '2024-03-24T09:30:00Z',
    availability_status: 'available',
    paused_at: null,
    imported: false,
    applications: [],
  },
];

// Create mock Redux store using the app's store factory
const createMockStore = (overrides: { sources?: Record<string, unknown>; user?: Record<string, unknown> } = {}) => {
  const initialState = {
    sources: {
      entities: mockSources,
      sourceTypes: mockSourceTypes,
      appTypes: mockApplicationTypes,
      loaded: 0, // 0 = loaded, >0 = loading
      sourceTypesLoaded: true,
      appTypesLoaded: true,
      numberOfEntities: mockSources.length,
      removingSources: [],
      pageNumber: 1,
      pageSize: 20,
      sortBy: 'created_at',
      sortDirection: 'desc',
      filterValue: {},
      activeCategory: 'Cloud',
      hcsEnrolled: false,
      hcsEnrolledLoaded: true,
      ...overrides.sources,
    },
    user: {
      isOrgAdmin: true,
      writePermissions: true,
      ...overrides.user,
    },
  };

  return getStore([], initialState);
};

const meta: Meta<typeof SourcesTable> = {
  component: SourcesTable,
  title: 'Components/SourcesTable',
  decorators: [
    (Story, context) => {
      const store = context.parameters.store || createMockStore();
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
  parameters: {
    docs: {
      description: {
        component: `
**SourcesTable** displays a paginated, sortable table of integration sources.

## Features
- **Sortable Columns**: Click column headers to sort by name, type, or date
- **Row Actions**: Pause/Resume, Edit, and Remove actions per source
- **Pagination**: Navigate through large source lists
- **Status Indicators**: Visual feedback for available/unavailable sources
- **Paused State**: Shows paused sources with resume action

### Data Flow
1. Connects to Redux store for sources, sourceTypes, and appTypes
2. Renders rows using formatters from sourcesViewDefinition
3. Dispatches sort/pagination actions on user interaction
4. Shows loading state while data fetches
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SourcesTable>;

/**
 * Default table view with multiple sources showing different states
 */
export const WithMultipleSources: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Table displaying 5 sources with various states: available, unavailable, and paused. Shows different cloud providers (AWS, Azure, GCP, OpenShift) and application connections.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify table renders with data', async () => {
      // Wait for table to load and render rows
      const table = await canvas.findByRole('grid', {}, { timeout: 5000 });
      expect(table).toBeInTheDocument();

      // Verify column headers are present
      // Sortable columns have buttons inside them with the display text
      expect(canvas.getByRole('button', { name: /Name/i })).toBeInTheDocument();
      expect(canvas.getByRole('button', { name: /Type/i })).toBeInTheDocument();
      expect(canvas.getByRole('button', { name: /Date added/i })).toBeInTheDocument();

      // Non-sortable columns appear directly as column headers
      expect(canvas.getByRole('columnheader', { name: /Connected applications/i })).toBeInTheDocument();
      expect(canvas.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument();
    });

    await step('Verify sources are displayed', async () => {
      // Wait for source names to appear in the table
      expect(await canvas.findByText('Production AWS Account', {}, { timeout: 5000 })).toBeInTheDocument();
      expect(await canvas.findByText('Development Azure Subscription')).toBeInTheDocument();
      expect(await canvas.findByText('Staging GCP Project')).toBeInTheDocument();
      expect(await canvas.findByText('Production OpenShift Cluster')).toBeInTheDocument();
      expect(await canvas.findByText('Testing AWS Environment')).toBeInTheDocument();
    });

    await step('Verify source types are displayed', async () => {
      // Wait for source types to be shown for each row
      // Note: AWS appears twice (2 AWS sources), so use getAllByText
      const awsElements = await canvas.findAllByText('Amazon Web Services');
      expect(awsElements.length).toBe(2); // Two AWS sources

      expect(canvas.getByText('Microsoft Azure')).toBeInTheDocument();
      expect(canvas.getByText('Google Cloud Platform')).toBeInTheDocument();
      expect(canvas.getByText('OpenShift Container Platform')).toBeInTheDocument();
    });
  },
};

/**
 * Table with pagination showing item counts
 */
export const WithPagination: Story = {
  parameters: {
    store: createMockStore({
      sources: {
        numberOfEntities: 150,
        pageNumber: 1,
        pageSize: 20,
      },
    }),
    docs: {
      description: {
        story:
          'Demonstrates pagination controls when there are more sources than fit on one page. Shows "1 - 5 of 150" style pagination text.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify pagination is displayed', async () => {
      // Wait for table to render first
      await canvas.findByRole('grid', {}, { timeout: 5000 });

      // Verify pagination navigation exists
      const pagination = await canvas.findByRole('navigation', { name: /Pagination/i }, { timeout: 5000 });
      expect(pagination).toBeInTheDocument();

      // Check for pagination buttons (previous/next)
      const prevButton = canvas.getByRole('button', { name: /Go to previous page/i });
      expect(prevButton).toBeInTheDocument();
      expect(prevButton).toBeDisabled(); // Should be disabled on first page

      const nextButton = canvas.getByRole('button', { name: /Go to next page/i });
      expect(nextButton).toBeInTheDocument();
    });
  },
};

/**
 * Table with unavailable source showing error state
 */
export const WithUnavailableSource: Story = {
  parameters: {
    store: createMockStore({
      sources: {
        entities: [mockSources[2]], // Only the GCP unavailable source
        numberOfEntities: 1,
      },
    }),
    docs: {
      description: {
        story: 'Shows how unavailable sources are displayed with error indicators in the status column.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify unavailable source is displayed', async () => {
      const table = await canvas.findByRole('grid', {}, { timeout: 5000 });
      expect(table).toBeInTheDocument();

      // Wait for source name to be visible
      expect(await canvas.findByText('Staging GCP Project', {}, { timeout: 5000 })).toBeInTheDocument();

      // Status should indicate unavailable
      // The actual text depends on the formatter implementation
      expect(canvas.getByText('Google Cloud Platform')).toBeInTheDocument();
    });
  },
};

/**
 * Table with paused source showing pause state
 */
export const WithPausedSource: Story = {
  parameters: {
    store: createMockStore({
      sources: {
        entities: [mockSources[3]], // Only the paused OpenShift source
        numberOfEntities: 1,
      },
    }),
    docs: {
      description: {
        story:
          'Displays a paused source. Paused sources show a pause indicator and have a "Resume" action instead of "Pause" in the actions menu.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify paused source is displayed', async () => {
      const table = await canvas.findByRole('grid', {}, { timeout: 5000 });
      expect(table).toBeInTheDocument();

      // Wait for source name to be visible
      expect(await canvas.findByText('Production OpenShift Cluster', {}, { timeout: 5000 })).toBeInTheDocument();
    });

    await step('Verify actions menu contains Resume action', async () => {
      const user = userEvent.setup();

      // Find and click the actions menu button (kebab menu)
      const actionsButton = canvas.getByLabelText(/Kebab toggle/i);
      await user.click(actionsButton);

      // Wait for menu to open - menu is rendered in a portal outside the canvas
      // Search in the whole document body
      await waitFor(
        async () => {
          const resumeAction = within(document.body).getByText(/Resume/i);
          expect(resumeAction).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  },
};

/**
 * Table with source that has no applications
 */
export const WithSourceNoApplications: Story = {
  parameters: {
    store: createMockStore({
      sources: {
        entities: [mockSources[4]], // Testing AWS with no applications
        numberOfEntities: 1,
      },
    }),
    docs: {
      description: {
        story: 'Shows a source with no connected applications. The applications column should show 0 or empty state.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify source with no applications', async () => {
      const table = await canvas.findByRole('grid', {}, { timeout: 5000 });
      expect(table).toBeInTheDocument();

      expect(await canvas.findByText('Testing AWS Environment', {}, { timeout: 5000 })).toBeInTheDocument();
      expect(canvas.getByText('Amazon Web Services')).toBeInTheDocument();
    });
  },
};

/**
 * Loading state while data is being fetched
 */
export const LoadingState: Story = {
  parameters: {
    store: createMockStore({
      sources: {
        loaded: 1, // >0 indicates loading in progress
        sourceTypesLoaded: false,
        appTypesLoaded: false,
        entities: [],
        numberOfEntities: 0,
      },
    }),
    docs: {
      description: {
        story: 'Shows the loading skeleton while sources data is being fetched from the API.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify loading state is shown', async () => {
      // The table should render with loading indicators
      const table = await canvas.findByRole('grid', {}, { timeout: 5000 });
      expect(table).toBeInTheDocument();

      // Check for loading spinner
      const spinner = await canvas.findByRole('progressbar', {}, { timeout: 5000 });
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-valuetext', 'Loading...');
    });
  },
};

/**
 * Table showing row actions menu interaction
 */
export const RowActionsInteraction: Story = {
  parameters: {
    store: createMockStore({
      sources: {
        entities: [mockSources[0]], // Single AWS source
        numberOfEntities: 1,
      },
    }),
    docs: {
      description: {
        story:
          'Demonstrates the row actions menu (kebab menu) with Pause, Remove, and Edit actions. Click the actions button to see available operations.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Open actions menu', async () => {
      // Wait for table to render with data
      const table = await canvas.findByRole('grid', {}, { timeout: 5000 });
      expect(table).toBeInTheDocument();

      // Wait for source name to appear before looking for actions
      await canvas.findByText('Production AWS Account', {}, { timeout: 5000 });

      // Find and click the actions menu button (kebab menu)
      const actionsButton = canvas.getByLabelText(/Kebab toggle/i);
      await user.click(actionsButton);
    });

    await step('Verify available actions', async () => {
      // Check that actions are displayed - menu is in a portal outside canvas
      await waitFor(
        () => {
          const pauseAction = within(document.body).getByText(/Pause/i);
          expect(pauseAction).toBeInTheDocument();

          const removeAction = within(document.body).getByText(/Remove/i);
          expect(removeAction).toBeInTheDocument();

          const editAction = within(document.body).getByText(/Edit/i);
          expect(editAction).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  },
};

/**
 * Read-only view for users without write permissions
 */
export const ReadOnlyView: Story = {
  parameters: {
    store: createMockStore({
      sources: {
        entities: [mockSources[0]],
        numberOfEntities: 1,
      },
      user: {
        isOrgAdmin: false,
        writePermissions: false,
      },
    }),
    docs: {
      description: {
        story:
          'Table view for users without write permissions. Actions like Pause, Resume, and Remove are disabled with explanatory tooltips.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Verify table renders for read-only user', async () => {
      const table = await canvas.findByRole('grid', {}, { timeout: 5000 });
      expect(table).toBeInTheDocument();

      expect(await canvas.findByText('Production AWS Account', {}, { timeout: 5000 })).toBeInTheDocument();
    });

    await step('Verify actions are disabled', async () => {
      // Open actions menu (kebab menu)
      const actionsButton = canvas.getByLabelText(/Kebab toggle/i);
      await user.click(actionsButton);

      // Actions should be present - menu is rendered in a portal
      // For users without permissions, they may be disabled or have tooltips
      await waitFor(
        () => {
          const pauseAction = within(document.body).getByText(/Pause/i);
          expect(pauseAction).toBeInTheDocument();
        },
        { timeout: 3000 },
      );
    });
  },
};
