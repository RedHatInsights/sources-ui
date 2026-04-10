import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { fn } from 'storybook/test';

// Types
export interface ChromeConfig {
  environment: string;
  auth?: {
    getUser?: () => Promise<unknown>;
    getToken?: () => Promise<string>;
    getUserPermissions?: () => Promise<unknown[]>;
    logout?: () => Promise<void>;
  };
  [key: string]: unknown;
}

export interface FeatureFlagsConfig {
  [flagName: string]: boolean;
}

// Chrome Context
const ChromeContext = createContext<ChromeConfig>({
  environment: 'prod',
});

export const ChromeProvider: React.FC<{ value: ChromeConfig; children: ReactNode }> = ({ value, children }) => (
  <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>
);

// Feature Flags Context
const FeatureFlagsContext = createContext<FeatureFlagsConfig>({});

export const FeatureFlagsProvider: React.FC<{ value: FeatureFlagsConfig; children: ReactNode }> = ({ value, children }) => (
  <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
);

// Chrome spy for testing - IS the spy function
export const chromeAppNavClickSpy = fn();

// Reset function to clear spy history between stories
export const resetChromeAppNavClickSpy = () => {
  chromeAppNavClickSpy.mockClear();
};

// Mock Hook Implementations (only for Storybook)
export const useChrome = () => {
  const chromeConfig = useContext(ChromeContext);

  return useMemo(() => {
    const defaultAuth = {
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
      getUserPermissions: () =>
        Promise.resolve([
          {
            permission: 'sources:*:*',
            resourceDefinitions: [],
          },
        ]),
      logout: () => Promise.resolve(),
    };

    return {
      getEnvironment: () => chromeConfig.environment,
      getEnvironmentDetails: () => ({
        environment: chromeConfig.environment,
        sso: 'https://sso.redhat.com',
        portal: 'https://console.redhat.com',
      }),
      isProd: () => chromeConfig.environment === 'prod',
      isBeta: () => chromeConfig.environment !== 'prod',
      appNavClick: chromeAppNavClickSpy,
      appObjectId: () => undefined,
      appAction: () => undefined,
      updateDocumentTitle: (title: string) => {
        // Mock document title update for Storybook
        if (typeof document !== 'undefined') {
          document.title = title;
        }
      },
      auth: {
        ...defaultAuth,
        ...(chromeConfig.auth || {}),
      },
      getBundle: () => 'sources',
      getApp: () => 'sources',
      ...chromeConfig,
    };
  }, [chromeConfig]);
};

export const useFlag = (flagName: string): boolean => {
  const flags = useContext(FeatureFlagsContext);
  return flags[flagName] || false;
};

// Configurable flags status for testing loading and error states
let flagsStatus = { flagsReady: true, flagsError: false };

export const setFlagsStatus = (status: { flagsReady?: boolean; flagsError?: boolean }) => {
  flagsStatus = { ...flagsStatus, ...status };
};

export const resetFlagsStatus = () => {
  flagsStatus = { flagsReady: true, flagsError: false };
};

// Re-export for Unleash mock compatibility
export const FlagProvider = FeatureFlagsProvider;
export const useFlagsStatus = () => flagsStatus;
export const useUnleashContext = () => ({});
export const IFlagProvider = FeatureFlagsProvider;

// Export contexts for direct use if needed
export { ChromeContext, FeatureFlagsContext };
