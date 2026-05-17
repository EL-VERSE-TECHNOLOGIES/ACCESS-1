import { test, expect } from '@playwright/test';

test('Landing page footer check', async ({ page }) => {
  await page.goto('http://localhost:3001/');
  await expect(page.locator('text=Admin Access')).toBeVisible();
  await page.screenshot({ path: 'final_landing_footer.png' });
});
