import { test, expect } from '@playwright/test';

test('Landing page has Admin Access in footer', async ({ page }) => {
  await page.goto('/');
  const adminLink = page.locator('text=Admin Access');
  await expect(adminLink).toBeVisible();
});

test('Community page renders', async ({ page }) => {
  await page.goto('/community');
  await expect(page.locator('h1')).toContainText('Fellow');
});

test('Support page renders', async ({ page }) => {
  await page.goto('/support');
  await expect(page.locator('h1')).toContainText('Support');
});

test('Projects page renders', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('h1')).toContainText('Active Projects');
});
