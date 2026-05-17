import { test, expect } from '@playwright/test';

test('Favicon and Branding check', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  // Check favicon link in head
  const favicon = await page.locator('link[rel="icon"]').getAttribute('href');
  expect(favicon).toBe('/images/new_logo.jpg');

  await page.screenshot({ path: 'final_branding_landing.png' });
});

test('Login page branding', async ({ page }) => {
  await page.goto('http://localhost:3001/login');
  await page.screenshot({ path: 'final_branding_login.png' });
});
