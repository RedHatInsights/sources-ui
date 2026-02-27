import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, within } from 'storybook/test';
import CloudEmptyState from './CloudEmptyState';

const meta: Meta = {
  component: CloudEmptyState,
  parameters: {
    docs: {
      description: {
        component: `
**CloudEmptyState** displays the initial cloud provider selection interface.

## Responsibilities
- **Provider Selection**: Shows available cloud providers (AWS, Azure, GCP, IBM)
- **User Guidance**: Provides clear messaging to guide users to select a provider
- **External Links**: Links to Red Hat Cloud Provider catalog for additional options
- **Callback Integration**: Invokes setSelectedType callback when provider is clicked

### Why This Matters
This is the entry point for the cloud source integration workflow. Users need:
1. Clear visibility of all available cloud providers
2. Visual icons to quickly identify providers
3. Access to additional provider information via catalog link
4. Simple click interaction to begin the integration process

### Usage
\`\`\`tsx
const [selectedType, setSelectedType] = useState(null);

<CloudEmptyState setSelectedType={setSelectedType} />
\`\`\`

### Integration Notes
- CloudTiles component handles the actual tile rendering
- Provider tiles are filtered based on activeCategory from Redux
- Requires Redux sourceTypes to be populated
- Respects user write permissions (disabled state for read-only users)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CloudEmptyState>;

/**
 * Default state showing cloud provider selection card
 */
export const DefaultState: Story = {
  args: {
    setSelectedType: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify card structure renders', async () => {
      // Verify the card title appears
      const title = canvas.getByText('Get started by connecting to your public clouds');
      expect(title).toBeInTheDocument();

      // Verify descriptive text
      const description = canvas.getByText('Select an available provider.');
      expect(description).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Initial state showing the cloud provider selection card with title and description.',
      },
    },
  },
};

/**
 * Shows the catalog link for additional providers
 */
export const CatalogLink: Story = {
  render: () => {
    const handleSelect = fn();
    return <CloudEmptyState setSelectedType={handleSelect} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify catalog link', async () => {
      // Find the catalog link
      const catalogLink = canvas.getByRole('link', { name: /See all Red Hat Certified Cloud and Service Providers/i });
      expect(catalogLink).toBeInTheDocument();
      expect(catalogLink).toHaveAttribute('href', 'https://catalog.redhat.com/cloud');
      expect(catalogLink).toHaveAttribute('target', '_blank');
      expect(catalogLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'External link to Red Hat Cloud Provider catalog opens in new tab with proper security attributes (noopener noreferrer).',
      },
    },
  },
};

/**
 * Demonstrates the component structure
 */
export const ComponentStructure: Story = {
  args: {
    setSelectedType: fn(),
  },
  play: async ({ canvasElement, step }) => {
    await step('Verify semantic structure', async () => {
      // Should render as a card with proper semantic elements
      const card = canvasElement.querySelector('.src-c-card__cloud-empty-state');
      expect(card).toBeInTheDocument();

      // Provider tiles container should exist
      const tilesContainer = canvasElement.querySelector('.provider-tiles');
      expect(tilesContainer).toBeInTheDocument();

      // Footer with catalog link
      const footer = canvasElement.querySelector('.cloud-footer');
      expect(footer).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Component uses PatternFly Card with CardTitle, CardBody, and CardFooter. Custom CSS classes organize the provider tiles and catalog link.',
      },
    },
  },
};
