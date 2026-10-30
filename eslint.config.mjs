import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default defineConfig([
  globalIgnores(['node_modules/', 'playwright-report/', 'test-results/', 'playwright/']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'error',
    },
  },
  {
    // Setup files fail by throwing (see helpers/session.helper.ts), not via expect().
    files: ['tests/**/*.setup.ts'],
    rules: { 'playwright/expect-expect': 'off' },
  },
]);
