const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

function describeViolations(violations) {
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`)
    .join('\n');
}

async function seriousOrCriticalViolations(page) {
  const results = await new AxeBuilder({ page }).analyze();
  return results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
}

test.describe('accessibility', () => {
  test('résumé page has no serious or critical violations', async ({ page }) => {
    await page.goto('/');
    const violations = await seriousOrCriticalViolations(page);
    expect(violations, describeViolations(violations)).toEqual([]);
  });

  test('tutorial page has no serious or critical violations', async ({ page }) => {
    await page.goto('/tutorial.html');
    const violations = await seriousOrCriticalViolations(page);
    expect(violations, describeViolations(violations)).toEqual([]);
  });
});
