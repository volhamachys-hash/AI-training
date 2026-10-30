import 'dotenv/config';
import { defineConfig } from '@playwright/test';
import { env, SESSION_STORAGE_STATE } from './config/env';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Tests of one stand share one database: keep them sequential. */
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Host of the stand (from SESSION_URL): endpoint paths (e.g. '/store/regions') live in API clients. */
    baseURL: env.baseUrl,

    /* Collect trace (requests and responses) when retrying the failed test. */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'api',
      testIgnore: /.*\.setup\.ts/,
      /* The `request` fixture carries the stand cookie saved by the setup project. */
      use: { storageState: SESSION_STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
