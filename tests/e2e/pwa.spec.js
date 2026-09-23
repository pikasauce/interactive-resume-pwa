const { test, expect } = require('@playwright/test');

test.describe('PWA manifest', () => {
  test('exposes the fields required for installability', async ({ request }) => {
    const response = await request.get('/manifest.webmanifest');
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(typeof manifest.name).toBe('string');
    expect(manifest.name.length).toBeGreaterThan(0);
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) {
      expect(typeof icon.src).toBe('string');
      expect(typeof icon.type).toBe('string');
    }
  });
});

test.describe('offline support', () => {
  test('the app shell still renders once cached and the network is gone', async ({ page, context }) => {
    // First load: registers the service worker and lets its install event
    // finish caching APP_SHELL. `serviceWorker.ready` only resolves once a
    // worker has *activated*, which (per service-worker.js) can only happen
    // after the install event's cache.addAll(APP_SHELL) has completed.
    await page.goto('/');
    await page.evaluate(() => navigator.serviceWorker.ready);

    // Reload once while still online so this navigation itself is served
    // through the now-active service worker (not just background-cached).
    await page.reload();
    await expect(page.getByRole('heading', { name: /Enrique Pujol/i })).toBeVisible();

    // Now actually cut the network and reload again. Without a working
    // cache-first service worker, this would show the browser's offline
    // error page instead of the résumé.
    await context.setOffline(true);
    try {
      await page.reload();
      await expect(page.getByRole('heading', { name: /Enrique Pujol/i })).toBeVisible();
      await expect(page.getByText('DevOps & Release Engineer', { exact: true })).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
