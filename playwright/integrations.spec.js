import { authTest, expect } from './fixtures.js';

authTest.use({ ignoreHTTPSErrors: true });

authTest.describe('integrations application', async () => {
  authTest('navigate to integrations via settings dropdown', async ({ page }) => {
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
