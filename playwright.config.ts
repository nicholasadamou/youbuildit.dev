import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:4318', trace: 'retain-on-failure' },
  webServer: {
    command: 'bun run start --hostname 127.0.0.1 --port 4318',
    url: 'http://127.0.0.1:4318',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
