import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',

  // Global setup for authentication
  // Authenticates once before all tests and saves the session state
  globalSetup: '@redhat-cloud-services/playwright-test-auth/global-setup',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://stage.foo.redhat.com:1337',
    ignoreHTTPSErrors: true,

    // Storage state for authenticated sessions
    // Global setup saves authentication here, all tests reuse it
    storageState: 'playwright/.auth/user.json',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
