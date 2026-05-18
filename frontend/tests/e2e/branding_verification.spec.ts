import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 720 } });

test('Full Branding and UI Verification', async ({ page }) => {
  // 1. Landing Page
  await page.goto('http://localhost:3000/');
  await expect(page.locator('footer >> text=Admin Access')).toBeVisible();
  await page.screenshot({ path: 'v3_landing.png', fullPage: true });

  // 2. Login Page
  await page.goto('http://localhost:3000/login');
  await page.screenshot({ path: 'v3_login.png' });

  // 3. Mock Auth Session for protected pages
  await page.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'mock-token');
  });

  // 4. Dashboard
  await page.goto('http://localhost:3000/dashboard');
  await page.screenshot({ path: 'v3_dashboard.png', fullPage: true });

  // 5. Community
  await page.goto('http://localhost:3000/community');
  await page.screenshot({ path: 'v3_community.png', fullPage: true });

  // 6. Support
  await page.goto('http://localhost:3000/support');
  await page.screenshot({ path: 'v3_support.png', fullPage: true });

  // 7. Projects
  await page.goto('http://localhost:3000/projects');
  await page.screenshot({ path: 'v3_projects.png', fullPage: true });
});
