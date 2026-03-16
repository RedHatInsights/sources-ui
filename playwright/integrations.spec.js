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

    // Debug: Check if .sources element exists
    const sourcesCount = await page.locator('.sources').count();
    console.log(`\n=== DEBUG: .sources element count: ${sourcesCount} ===`);

    if (sourcesCount > 0) {
      const sourcesHTML = await page.locator('.sources').innerHTML();
      console.log('\n=== DEBUG: .sources HTML content ===');
      console.log(sourcesHTML);
      console.log('\n=== DEBUG: .sources text content ===');
      const sourcesText = await page.locator('.sources').textContent();
      console.log(sourcesText);
    } else {
      console.log('\n=== DEBUG: .sources element NOT FOUND ===');

      // Print page title and URL
      const pageTitle = await page.title();
      console.log(`\n=== DEBUG: Page Title: ${pageTitle} ===`);
      console.log(`=== DEBUG: Current URL: ${page.url()} ===`);

      // Print body text content (first 500 chars)
      const bodyText = await page.locator('body').textContent();
      console.log(`\n=== DEBUG: Body text content (first 500 chars) ===`);
      console.log(bodyText.substring(0, 500));

      // Print body HTML (first 1000 chars to see structure)
      const bodyHTML = await page.locator('body').innerHTML();
      console.log(`\n=== DEBUG: Body HTML (first 1000 chars) ===`);
      console.log(bodyHTML.substring(0, 1000));

      // List all h1 elements
      const h1Count = await page.locator('h1').count();
      console.log(`\n=== DEBUG: Found ${h1Count} h1 elements ===`);
      if (h1Count > 0) {
        for (let i = 0; i < h1Count; i++) {
          const h1Text = await page.locator('h1').nth(i).textContent();
          console.log(`  h1[${i}]: "${h1Text}"`);
        }
      }

      // List all elements with class containing "source"
      const sourceRelatedElements = await page.locator('[class*="source"]').count();
      console.log(`\n=== DEBUG: Found ${sourceRelatedElements} elements with class containing "source" ===`);

      if (sourceRelatedElements > 0) {
        console.log('Elements with "source" in class name:');
        for (let i = 0; i < Math.min(sourceRelatedElements, 5); i++) {
          const className = await page.locator('[class*="source"]').nth(i).getAttribute('class');
          console.log(`  [${i}]: ${className}`);
        }
      }
    }

    // Wait for the h1 "Integrations" heading to be visible
    await expect(page.locator('h1')).toContainText('Integrations', { timeout: 15000 });
  });
});
