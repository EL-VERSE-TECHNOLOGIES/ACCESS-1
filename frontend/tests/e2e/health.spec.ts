import { test, expect } from '@playwright/test'

test('health page responds', async ({ page, baseURL }) => {
  await page.goto(baseURL + '/health')
  await expect(page).toHaveTitle(/Backend Health|EL ACCESS/)
})
