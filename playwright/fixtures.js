/**
 * Playwright test fixtures and utilities for sources-ui
 *
 * Authentication is handled globally via @redhat-cloud-services/playwright-test-auth
 * Tests automatically load authenticated session state from playwright/.auth/user.json
 */

/**
 * Prevents inconsistent cookie prompting that is problematic for UI testing
 * Blocks requests to TrustArc consent service
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function disableCookiePrompt(page) {
  await page.route('**/*', async (route, request) => {
    if (request.url().includes('consent.trustarc.com') && request.resourceType() !== 'document') {
      await route.abort();
    } else {
      await route.continue();
    }
  });
}
