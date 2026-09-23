const { test, expect } = require('@playwright/test');

function registerSharedChecks() {
  test('hero content does not overflow the viewport width', async ({ page }) => {
    await page.goto('/');
    const heroBox = await page.locator('.hero').boundingBox();
    const viewportSize = page.viewportSize();
    expect(heroBox).not.toBeNull();
    expect(heroBox.width).toBeLessThanOrEqual(viewportSize.width);
  });

  test('install button stays hidden until beforeinstallprompt fires', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#install-button')).toBeHidden();
  });
}

test.describe('mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  registerSharedChecks();

  test('primary navigation is reachable behind the nav toggle', async ({ page }) => {
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: 'Primary navigation' });
    const toggle = page.locator('#nav-toggle');

    // Below 700px, nav is intentionally collapsed behind a toggle rather
    // than shown inline (there isn't room for it in the header) - but it
    // must still be reachable, not just removed.
    await expect(nav).toBeHidden();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();

    await expect(nav).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: 'Experience' })).toBeVisible();
  });

  test('choosing a nav link closes the menu again', async ({ page }) => {
    await page.goto('/');

    await page.locator('#nav-toggle').click();
    await page.getByRole('link', { name: 'Experience' }).click();

    await expect(page).toHaveURL(/#experience$/);
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeHidden();
    await expect(page.locator('#nav-toggle')).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('desktop viewport', () => {
  test.use({ viewport: { width: 1280, height: 800 } });
  registerSharedChecks();

  test('primary navigation is visible without needing a toggle', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
    await expect(page.locator('#nav-toggle')).toBeHidden();
  });
});
