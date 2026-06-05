import { test, expect } from '@playwright/test';
import { disableCookiePrompt } from './fixtures.js';

test.describe('integrations application', async () => {
  test('navigate to integrations via settings dropdown', async ({ page }) => {
    // Block cookie prompts before navigation
    await disableCookiePrompt(page);

    // Navigate to the application (already authenticated via globalSetup)
    await page.goto('/');
    // Click on the settings icon
    await page.getByLabel('Settings menu').click();

    // Click on integrations in the dropdown
    await page.locator('.chr-c-menu-settings [data-quickstart-id="settings_integrations"]').click();

    // Expect the integrations page to be present
    await expect(page).toHaveURL(/\/settings\/integrations/);

    // Wait for the h1 "Integrations" heading to be visible
    await expect(page.locator('h1')).toContainText('Integrations', { timeout: 15000 });
  });
});
