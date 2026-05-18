import { test, expect } from '@playwright/test';

test('Landing page footer check', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('footer >> text=Admin Access')).toBeVisible();
  await page.screenshot({ path: 'final_landing_footer.png' });
});
