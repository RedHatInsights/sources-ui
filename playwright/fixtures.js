/**
 * Playwright test fixtures and utilities for sources-ui
 *
 * Authentication is handled globally via @redhat-cloud-services/playwright-test-auth
 * Tests automatically load authenticated session state from playwright/.auth/user.json
 */

// Re-export utilities from shared package
export { disableCookiePrompt } from '@redhat-cloud-services/playwright-test-auth';
