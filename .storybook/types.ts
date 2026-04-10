/**
 * Shared types for Storybook decorator arguments
 * These can be used across all stories to ensure consistency
 */

// Chrome decorator arguments
export interface ChromeArgs {
  environment?: 'prod' | 'stage' | 'ci-beta' | 'ci-stable' | 'qa-beta' | 'qa-stable';
}

// Feature flags decorator arguments
export interface FeatureFlagsArgs {
  [flagName: string]: boolean;
}

// Combined decorator arguments
export interface DecoratorArgs extends ChromeArgs {
  featureFlags?: FeatureFlagsArgs;
}

// Utility type to create story args by extending component props with decorator args
export type StoryArgs<T = Record<string, never>> = T & DecoratorArgs;

// Default values for decorator arguments
export const DEFAULT_DECORATOR_ARGS: DecoratorArgs = {
  environment: 'prod',
};

// ArgTypes configuration for decorator controls
export const DECORATOR_ARG_TYPES = {
  // Chrome controls
  environment: {
    control: 'select',
    options: ['prod', 'stage', 'ci-beta', 'ci-stable', 'qa-beta', 'qa-stable'],
    description: 'Environment for Chrome API',
    table: {
      category: 'Chrome',
    },
  },
} as const;
