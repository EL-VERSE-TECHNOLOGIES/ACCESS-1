# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: branding_verification.spec.ts >> Full Branding and UI Verification
- Location: tests/e2e/branding_verification.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Admin Access')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Admin Access')

```

```yaml
- alert
- dialog "Server Error":
  - navigation:
    - button "previous" [disabled]:
      - img "previous"
    - button "next" [disabled]:
      - img "next"
    - text: 1 of 1 error Next.js (14.2.35) is outdated
    - link "(learn more)":
      - /url: https://nextjs.org/docs/messages/version-staleness
  - heading "Server Error" [level=1]
  - paragraph: "Error: Cannot find module './chunks/vendor-chunks/next.js' Require stack: - /app/frontend/.next/server/webpack-runtime.js - /app/frontend/.next/server/pages/_document.js - /app/frontend/node_modules/next/dist/server/require.js - /app/frontend/node_modules/next/dist/server/load-components.js - /app/frontend/node_modules/next/dist/build/utils.js - /app/frontend/node_modules/next/dist/server/dev/hot-middleware.js - /app/frontend/node_modules/next/dist/server/dev/hot-reloader-webpack.js - /app/frontend/node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js - /app/frontend/node_modules/next/dist/server/lib/router-server.js - /app/frontend/node_modules/next/dist/server/lib/start-server.js"
  - text: This error happened while generating the page. Any console logs will be displayed in the terminal window.
  - heading "Call Stack" [level=2]
  - group:
    - img
    - img
    - text: Next.js
  - heading "TracingChannel.traceSync" [level=3]
  - text: node:diagnostics_channel (328:14)
  - group:
    - img
    - img
    - text: Next.js
  - heading "Array.reduce" [level=3]
  - text: <anonymous>
  - group:
    - img
    - img
    - text: Next.js
  - heading "Array.map" [level=3]
  - text: <anonymous>
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.use({ viewport: { width: 1280, height: 720 } });
  4  |
  5  | test('Full Branding and UI Verification', async ({ page }) => {
  6  |   // 1. Landing Page
  7  |   await page.goto('http://localhost:3001/');
> 8  |   await expect(page.locator('text=Admin Access')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  9  |   await page.screenshot({ path: 'v3_landing.png', fullPage: true });
  10 |
  11 |   // 2. Login Page
  12 |   await page.goto('http://localhost:3001/login');
  13 |   await page.screenshot({ path: 'v3_login.png' });
  14 |
  15 |   // 3. Mock Auth Session for protected pages
  16 |   await page.addInitScript(() => {
  17 |     window.localStorage.setItem('accessToken', 'mock-token');
  18 |   });
  19 |
  20 |   // 4. Dashboard
  21 |   await page.goto('http://localhost:3001/dashboard');
  22 |   await page.screenshot({ path: 'v3_dashboard.png', fullPage: true });
  23 |
  24 |   // 5. Community
  25 |   await page.goto('http://localhost:3001/community');
  26 |   await page.screenshot({ path: 'v3_community.png', fullPage: true });
  27 |
  28 |   // 6. Support
  29 |   await page.goto('http://localhost:3001/support');
  30 |   await page.screenshot({ path: 'v3_support.png', fullPage: true });
  31 |
  32 |   // 7. Projects
  33 |   await page.goto('http://localhost:3001/projects');
  34 |   await page.screenshot({ path: 'v3_projects.png', fullPage: true });
  35 | });
  36 |
```