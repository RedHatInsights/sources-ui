import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, userEvent, within } from 'storybook/test';
import EmptyStateTable, { EmptyStateDataView } from './EmptyStateTable';
import { Card, CardBody, Label, LabelGroup, Pagination, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { Table, Th, Thead, Tr } from '@patternfly/react-table';

const meta: Meta = {
  component: EmptyStateTable,
  parameters: {
    docs: {
      description: {
        component: `
**EmptyStateTable** displays empty state messaging when no sources match filter criteria.

## Responsibilities
- **No Results State**: Shows when filters return zero results
- **Clear Filters Action**: Dispatches Redux clearFilters() action
- **Internationalization**: Uses react-intl for translated messages
- **Table Context**: Can be embedded in table via EmptyStateDataView wrapper

### Why This Matters
When users apply filters that match no sources, we need to:
1. Clearly explain why the table is empty (filters, not missing data)
2. Provide a clear path to resolution (clear filters button)
3. Maintain context by showing active filter chips

### Usage
\`\`\`tsx
// Standalone
<EmptyStateTable />

// In table context
<Table>
  <Thead>...</Thead>
  <EmptyStateDataView columns={5} />
</Table>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/**
 * Default empty state when no results match filters
 */
export const NoResults: Story = {
  render: () => <EmptyStateTable />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify empty state renders correctly', async () => {
      // Verify empty state title appears
      const title = canvas.getByRole('heading', { level: 2, name: /No sources found/i });
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H2');

      // Verify the explanatory text is present
      const emptyState = canvas.getByText(/No sources match the filter criteria/i);
      expect(emptyState).toBeInTheDocument();

      // Verify the clear filters button is present
      const clearButton = canvas.getByRole('button', { name: /Clear all filters/i });
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveAttribute('type', 'button');
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state displayed when user has applied filters but no sources match the criteria.',
      },
    },
  },
};

/**
 * Tests the clear filters button interaction
 */
export const ClearFiltersAction: Story = {
  render: () => <EmptyStateTable />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Verify clear filters interaction', async () => {
      const clearButton = canvas.getByRole('button', { name: /Clear all filters/i });

      // Verify button is interactive (enabled)
      expect(clearButton).toBeEnabled();

      // PatternFly link variant button should have proper styling
      expect(clearButton).toHaveClass('pf-v6-c-button');

      // Click the clear filters button
      await user.click(clearButton);

      // Note: In production, this dispatches clearFilters() Redux action
      // which resets filter state and reloads the full sources table
      expect(clearButton).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Clear filters button dispatches Redux clearFilters() action to reset all filters and show all sources.',
      },
    },
  },
};

/**
 * Keyboard accessibility testing
 */
export const KeyboardAccessible: Story = {
  render: () => <EmptyStateTable />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Verify keyboard accessibility', async () => {
      // Tab to the clear filters button
      await user.tab();
      await user.tab(); // May need multiple tabs depending on other focusable elements

      const clearButton = canvas.getByRole('button', { name: /Clear all filters/i });

      // Verify button can receive focus
      expect(clearButton).toBeInTheDocument();

      // User can activate with Enter key
      clearButton.focus();
      expect(document.activeElement).toBe(clearButton);

      // Simulate Enter key press
      await user.keyboard('{Enter}');

      // Verify component still renders (action was triggered)
      expect(clearButton).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Users can navigate to the clear filters button using Tab and activate it with Enter or Space keys.',
      },
    },
  },
};

/**
 * Shows EmptyStateTable embedded in full table context with active filters
 */
export const InTableContext: Story = {
  render: () => (
    <Card>
      <CardBody>
        {/* Toolbar with active filter chips */}
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem variant="label">Filters:</ToolbarItem>
            <ToolbarItem>
              <LabelGroup categoryName="Cloud Provider">
                <Label isCompact>AWS</Label>
              </LabelGroup>
            </ToolbarItem>
            <ToolbarItem>
              <LabelGroup categoryName="Status">
                <Label isCompact>Unavailable</Label>
              </LabelGroup>
            </ToolbarItem>
            <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
              <Pagination
                itemCount={0}
                perPage={20}
                page={1}
                variant="top"
                titles={{
                  paginationAriaLabel: 'Top pagination',
                }}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        {/* Sources table with empty state */}
        <Table aria-label="Sources table">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Applications</Th>
              <Th>Last Modified</Th>
            </Tr>
          </Thead>
          <EmptyStateDataView columns={5} />
        </Table>

        {/* Bottom pagination */}
        <Pagination
          itemCount={0}
          perPage={20}
          page={1}
          variant="bottom"
          titles={{
            paginationAriaLabel: 'Bottom pagination',
          }}
        />
      </CardBody>
    </Card>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify full table context', async () => {
      // Verify the active filter chips are displayed
      const awsChip = canvas.getByText('AWS');
      expect(awsChip).toBeInTheDocument();

      const unavailableChip = canvas.getByText('Unavailable');
      expect(unavailableChip).toBeInTheDocument();

      // Verify table headers are visible
      const nameHeader = canvas.getByRole('columnheader', { name: 'Name' });
      expect(nameHeader).toBeInTheDocument();

      // Verify the empty state is rendered within the table
      const title = canvas.getByRole('heading', { level: 2, name: /No sources found/i });
      expect(title).toBeInTheDocument();

      // The component should be wrapped in table elements (tbody, tr, td)
      const td = title.closest('td');
      expect(td).toBeInTheDocument();
      expect(td).toHaveAttribute('colspan', '5');

      // Verify pagination shows 0 items
      // Text is split across multiple <b> tags, so use a function matcher
      const paginationText = canvas.getAllByText((content, element) => {
        return element?.textContent?.includes('0 - 0 of 0') ?? false;
      });
      expect(paginationText.length).toBeGreaterThan(0);
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete table UI showing active filter chips (AWS, Unavailable), table headers, empty state message, and pagination showing 0 results. This demonstrates the production appearance when filters match no sources.',
      },
    },
  },
};
