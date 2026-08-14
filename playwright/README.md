# End-to-End Testing with Playwright

This directory contains E2E tests for the Integrations application using Playwright.

## Prerequisites

Before running the tests, you need to:

1. **Run the application locally**
   - The tests expect the application to be running and accessible
   - Default: `https://stage.foo.redhat.com:1337`
   - You'll need to set up your local proxy configuration to point to your local dev server

2. **Set up environment variables**
   - `E2E_USER` - Red Hat SSO username for testing
   - `E2E_PASSWORD` - Red Hat SSO password for testing
   - `APP_TEST_HOST_PORT` (optional) - Custom URL for the test environment

## Running Tests

Basic command with required credentials:

```bash
E2E_USER=your-username E2E_PASSWORD=your-password npm run playwright -- test
```

### Running with Custom URL

Override the default test URL:

```bash
APP_TEST_HOST_PORT=localhost:8080 E2E_USER=your-username E2E_PASSWORD=your-password npm run playwright -- test
```

### Running Specific Tests

Run a specific test file:

```bash
E2E_USER=your-username E2E_PASSWORD=your-password npm run playwright -- test integrations.spec.js
```

### Debug Mode

Run tests in headed mode (see the browser):

```bash
E2E_USER=your-username E2E_PASSWORD=your-password npm run playwright -- test --headed
```

Run tests in debug mode with Playwright Inspector:

```bash
E2E_USER=your-username E2E_PASSWORD=your-password npm run playwright -- test --debug
```

## Writing Tests

### Authenticated Tests

Most tests require user authentication. Use `authTest` instead of `test` to automatically handle login:

```javascript
import { authTest, expect } from './fixtures.js';

authTest.use({ ignoreHTTPSErrors: true });

authTest.describe('my feature', () => {
  authTest('should do something', async ({ page }) => {
    // User is already logged in here
    await page.goto('/settings/integrations');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Using Authentication Utilities

You can also use the authentication functions directly:

```javascript
import { ensureLoggedIn, login, disableCookiePrompt } from './fixtures.js';

// Ensure user is logged in (checks if already logged in first)
await ensureLoggedIn(page);

// Direct login
await login(page, 'username', 'password');

// Disable cookie prompts
await disableCookiePrompt(page);
```

## Test Artifacts

When tests fail, the following artifacts are captured:

- **Screenshots** - Saved in `test-results/`
- **Videos** - Saved in `test-results/`
- **Traces** - Captured on first retry, viewable with `npx playwright show-trace`

These artifacts are automatically ignored by git (see `.gitignore`).

## Configuration

The Playwright configuration is in `playwright.config.js` and includes:

- Video recording on failure
- Screenshots on failure
- Trace recording on first retry
- Automatic retries in CI (2 retries)
- Single worker in CI for stability

## Project Structure

```
playwright/
├── README.md                 # This file
├── fixtures.js               # Authentication utilities and authTest fixture
├── integrations.spec.js      # Integration page tests
└── [other test files]
```

## Troubleshooting

### Login Fails

- Verify your `E2E_USER` and `E2E_PASSWORD` are correct
- Check that your SSO account has access to the environment
- Ensure the application is running and accessible

### Tests Timeout

- Check that your local dev server is running
- Verify the `APP_TEST_HOST_PORT` matches your actual server
- Check network connectivity to external dependencies

### Certificate Errors

Tests use `ignoreHTTPSErrors: true` to handle self-signed certificates in development environments. This is configured per-test using `authTest.use()`.
