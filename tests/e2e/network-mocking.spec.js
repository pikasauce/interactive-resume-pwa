const { test, expect } = require('@playwright/test');

// These prove the résumé's release-signal UI is actually driven by
// whatever resume-api returns (or fails to return) at runtime, rather than
// being hardcoded text — by intercepting the request itself with
// page.route() instead of relying on the real resume-api process.
test.describe('release signal / network mocking', () => {
  test('renders whatever the API returns', async ({ page }) => {
    await page.route('**/release-signal', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'mocked',
          message: 'Custom mocked signal for testing',
        }),
      })
    );

    await page.goto('/');

    await expect(page.locator('#api-status')).toHaveText('mocked: Custom mocked signal for testing');
  });

  test('falls back gracefully when the API returns an error', async ({ page }) => {
    await page.route('**/release-signal', (route) => route.fulfill({ status: 500 }));

    await page.goto('/');

    await expect(page.locator('#api-status')).toHaveText('Release signal unavailable — retry shortly');
  });

  test('falls back gracefully when the request is aborted outright', async ({ page }) => {
    await page.route('**/release-signal', (route) => route.abort());

    await page.goto('/');

    await expect(page.locator('#api-status')).toHaveText('Release signal unavailable — retry shortly');
  });
});
