import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FormRenderer, Schema } from '@data-driven-forms/react-form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import CardSelect from './CardSelect';
import { AwsIcon, AzureIcon, GoogleIcon } from '@patternfly/react-icons';

const meta: Meta = {
  component: CardSelect,
  parameters: {
    docs: {
      description: {
        component: `
**CardSelect** provides a tile-based selection interface for Data-Driven Forms.

## Responsibilities
- **Multi-Select Mode**: Allows selection of multiple cards simultaneously
- **Single-Select Mode**: Enforces single selection with automatic deselection
- **Form Integration**: Integrates with Data-Driven Forms useFieldApi and useFormApi
- **Keyboard Accessible**: Full keyboard navigation and activation support
- **Icon Support**: Renders custom icons via iconMapper prop

### Usage in Data-Driven Forms
\`\`\`tsx
<FormRenderer
  schema={{
    fields: [{
      component: 'card-select',
      name: 'applications',
      isMulti: true,
      options: [
        { value: 'app1', label: 'Application 1' },
        { value: 'app2', label: 'Application 2' }
      ]
    }]
  }}
  componentMapper={{
    ...componentMapper,
    'card-select': CardSelect
  }}
/>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Helper to reduce FormRenderer boilerplate
const buildFormStory = (schema: Schema, overrides?: Record<string, unknown>) => (
  <FormRenderer
    FormTemplate={FormTemplate}
    schema={schema}
    componentMapper={{
      ...componentMapper,
      'card-select': CardSelect,
    }}
    onSubmit={fn()}
    {...overrides}
  />
);

/**
 * Default state showing unselected cards in multi-select mode
 */
export const DefaultState: Story = {
  render: () =>
    buildFormStory({
      fields: [
        {
          component: 'card-select',
          name: 'applications',
          label: 'Select applications to connect',
          helperText: 'Choose one or more applications to integrate with your cloud source',
          isMulti: true,
          options: [
            { value: 'cost-management', label: 'Cost Management' },
            { value: 'cloud-meter', label: 'Cloud Meter' },
            { value: 'automation-analytics', label: 'Automation Analytics' },
          ],
        },
      ],
    }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify cards render correctly', async () => {
      // Wait for cards to render (Data-Driven Forms renders async)
      // Tiles have role="option" in PatternFly
      const costMgmtCard = await canvas.findByRole('option', { name: 'Cost Management' });
      expect(costMgmtCard).toBeInTheDocument();

      const cloudMeterCard = await canvas.findByRole('option', { name: 'Cloud Meter' });
      expect(cloudMeterCard).toBeInTheDocument();

      const autoAnalyticsCard = await canvas.findByRole('option', { name: 'Automation Analytics' });
      expect(autoAnalyticsCard).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Initial state with all cards unselected, ready for user interaction.',
      },
    },
  },
};

/**
 * Multi-select mode allows selecting multiple cards
 */
export const MultiSelect: Story = {
  render: () =>
    buildFormStory({
      fields: [
        {
          component: 'card-select',
          name: 'applications',
          label: 'Select applications to connect',
          isMulti: true,
          options: [
            { value: 'cost-management', label: 'Cost Management' },
            { value: 'cloud-meter', label: 'Cloud Meter' },
            { value: 'automation-analytics', label: 'Automation Analytics' },
          ],
        },
      ],
    }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Verify multi-select behavior', async () => {
      // Wait for cards to render and select them
      const costMgmtCard = await canvas.findByRole('option', { name: 'Cost Management' });
      await user.click(costMgmtCard);

      const cloudMeterCard = await canvas.findByRole('option', { name: 'Cloud Meter' });
      await user.click(cloudMeterCard);

      // Both should be selected simultaneously
      expect(costMgmtCard).toHaveClass('pf-m-selected');
      expect(cloudMeterCard).toHaveClass('pf-m-selected');
    });

    await step('Verify toggle deselection', async () => {
      const costMgmtCard = await canvas.findByRole('option', { name: 'Cost Management' });

      // Click again to deselect
      await user.click(costMgmtCard);
      expect(costMgmtCard).not.toHaveClass('pf-m-selected');
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select mode allows multiple cards to be selected simultaneously. Clicking a selected card deselects it.',
      },
    },
  },
};

/**
 * Single-select mode enforces one selection at a time
 */
export const SingleSelect: Story = {
  render: () =>
    buildFormStory({
      fields: [
        {
          component: 'card-select',
          name: 'cloud-provider',
          label: 'Select your cloud provider',
          isMulti: false, // Single-select mode
          options: [
            { value: 'aws', label: 'Amazon Web Services' },
            { value: 'azure', label: 'Microsoft Azure' },
            { value: 'google', label: 'Google Cloud Platform' },
          ],
          iconMapper: (value: string) => {
            const icons: Record<string, React.ComponentType> = {
              aws: AwsIcon,
              azure: AzureIcon,
              google: GoogleIcon,
            };
            return icons[value];
          },
        },
      ],
    }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Verify single-select behavior', async () => {
      // Wait for cards to render and click AWS
      const awsCard = await canvas.findByRole('option', { name: 'Amazon Web Services' });
      await user.click(awsCard);
      expect(awsCard).toHaveClass('pf-m-selected');

      // Click Azure - AWS should be automatically deselected
      const azureCard = await canvas.findByRole('option', { name: 'Microsoft Azure' });
      await user.click(azureCard);

      expect(azureCard).toHaveClass('pf-m-selected');
      expect(awsCard).not.toHaveClass('pf-m-selected');
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single-select mode automatically deselects the previous card when a new one is selected. Only one card can be active at a time.',
      },
    },
  },
};

/**
 * Demonstrates keyboard navigation and activation
 */
export const KeyboardAccessible: Story = {
  render: () =>
    buildFormStory({
      fields: [
        {
          component: 'card-select',
          name: 'applications',
          label: 'Select applications',
          options: [
            { value: 'cost-management', label: 'Cost Management' },
            { value: 'cloud-meter', label: 'Cloud Meter' },
          ],
        },
      ],
    }),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Verify keyboard navigation', async () => {
      // Wait for card to render
      const costMgmtCard = await canvas.findByRole('option', { name: 'Cost Management' });

      // Tab to first card
      await user.tab();

      // Verify Tab actually landed on the card
      expect(document.activeElement).toBe(costMgmtCard);

      // Press Space to select (standard button activation)
      await user.keyboard(' ');

      // Card should be selected
      expect(costMgmtCard).toHaveClass('pf-m-selected');
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'All cards are keyboard accessible. Users can Tab through cards and activate them with Space or Enter keys.',
      },
    },
  },
};

/**
 * Shows cards with pre-selected values via initialValues
 */
export const PreSelected: Story = {
  render: () =>
    buildFormStory(
      {
        fields: [
          {
            component: 'card-select',
            name: 'applications',
            label: 'Select applications to connect',
            isMulti: true,
            options: [
              { value: 'cost-management', label: 'Cost Management' },
              { value: 'cloud-meter', label: 'Cloud Meter' },
              { value: 'automation-analytics', label: 'Automation Analytics' },
            ],
          },
        ],
      },
      {
        initialValues: {
          applications: ['cost-management', 'cloud-meter'],
        },
      },
    ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Verify pre-selected state', async () => {
      // Wait for cards to render - should start selected (from initialValues)
      const costMgmtCard = await canvas.findByRole('option', { name: 'Cost Management' });
      expect(costMgmtCard).toHaveClass('pf-m-selected');

      const cloudMeterCard = await canvas.findByRole('option', { name: 'Cloud Meter' });
      expect(cloudMeterCard).toHaveClass('pf-m-selected');

      const autoAnalyticsCard = await canvas.findByRole('option', { name: 'Automation Analytics' });
      expect(autoAnalyticsCard).not.toHaveClass('pf-m-selected');
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Cards can be pre-selected using the initialValues prop in Data-Driven Forms.',
      },
    },
  },
};
