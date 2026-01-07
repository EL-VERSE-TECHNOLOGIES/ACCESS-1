import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    headless: true,
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
  }
})
