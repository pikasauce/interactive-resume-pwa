const { test, expect } = require('@playwright/test');
test('tailored DevOps resume renders its candidate and role', async ({ page }) => { await page.goto('/'); await expect(page).toHaveTitle(/Enrique Pujol/); await expect(page.getByRole('heading', { name: /Enrique Pujol/i })).toBeVisible(); await expect(page.getByText('DevOps & Release Engineer', { exact: true })).toBeVisible(); await expect(page.getByText('CI/CD change management', { exact: false })).toBeVisible(); });
test('release signal is supplied by the JSON API', async ({ page }) => { await page.goto('/'); await expect(page.getByText(/^ready: /)).toBeVisible(); });
test('tutorial is reachable as part of the portfolio', async ({ page }) => { await page.goto('/'); await page.getByRole('link', { name: /Read the tutorial/i }).click(); await expect(page.getByRole('heading', { name: /Build. Verify./i })).toBeVisible(); await expect(page.getByText('Quality as code')).toBeVisible(); });
test('experience navigation takes the reader to the experience section', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Experience' }).click();

  await expect(page).toHaveURL(/#experience$/);
  await expect(page.getByRole('heading', { name: 'Relevant experience' })).toBeVisible();
});