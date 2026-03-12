import { expect, test } from '@playwright/test';

const APP_TEST_HOST_PORT = process.env.APP_TEST_HOST_PORT || 'stage.foo.redhat.com:1337';

// Prevents inconsistent cookie prompting that is problematic for UI testing
export async function disableCookiePrompt(page) {
  await page.route('**/*', async (route, request) => {
    if (request.url().includes('consent.trustarc.com') && request.resourceType() !== 'document') {
      await route.abort();
    } else {
      await route.continue();
    }
  });
}

export async function login(page, user, password) {
  // Fail in a friendly way if the proxy config is not set up correctly
  await expect(page.locator('text=Lockdown'), 'proxy config incorrect').toHaveCount(0);

  await disableCookiePrompt(page);

  // Wait for and fill username field
  await page.getByLabel('Red Hat login').first().fill(user);
  await page.getByRole('button', { name: 'Next' }).click();

  // Wait for and fill password field
  await page.getByLabel('Password').first().fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  // confirm login was valid
  await expect(page.getByText('Invalid login')).not.toBeVisible();
}

export async function ensureLoggedIn(page) {
  await page.goto(`https://${APP_TEST_HOST_PORT}`, { waitUntil: 'load', timeout: 60000 });

  const loggedIn = await page.getByText('Hi,').isVisible();

  if (!loggedIn) {
    const user = process.env.E2E_USER;
    const password = process.env.E2E_PASSWORD;

    if (!user || !password) {
      throw new Error(
        'E2E_USER and E2E_PASSWORD environment variables are required for authentication.\n' +
          'Please set them before running the tests:\n' +
          'E2E_USER=your-username E2E_PASSWORD=your-password npm run playwright -- test',
      );
    }

    // make sure the SSO prompt is loaded for login
    await page.waitForLoadState('load');
    await expect(page.locator('#username-verification')).toBeVisible();
    await login(page, user, password);
    await page.waitForLoadState('load');
    await expect(page.getByText('Invalid login')).not.toBeVisible();

    // long wait for the page to load; stage can be delicate
    await page.waitForTimeout(5000);
    await expect(page.getByLabel('Settings menu'), 'settings menu not displayed').toBeVisible();

    // conditionally accept cookie prompt
    const acceptAllButton = page.getByRole('button', { name: 'Accept all' });
    if (await acceptAllButton.isVisible()) {
      await acceptAllButton.click();
    }
  }
}

export const authTest = test.extend({
  authenticatedPage: [
    async ({ page }, use) => {
      // This code runs before every test
      await ensureLoggedIn(page);
      await use(page);
      // Code after use() would run after every test
    },
    { auto: true },
  ],
});

export { expect };
