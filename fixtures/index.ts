import { test as base, expect as baseExpect } from '@playwright/test';
import { AnySchema } from 'ajv';
import { env } from '../config/env';
import { validateSchema } from '../helpers/schema.helper';
import { StoreRegionsClient } from '../api/store/regions.client';

type ApiFixtures = {
  /** Store API: Regions, with the publishable API key of your stand. */
  storeRegions: StoreRegionsClient;
};

export const test = base.extend<ApiFixtures>({
  storeRegions: async ({ request }, use) => {
    await use(new StoreRegionsClient(request, env.publishableApiKey));
  },
});

export const expect = baseExpect.extend({
  /** expect(body).toMatchSchema(schema): JSON Schema validation with the list of violations. */
  toMatchSchema(received: unknown, schema: AnySchema) {
    const errors = validateSchema(schema, received);
    const pass = errors.length === 0;
    return {
      pass,
      name: 'toMatchSchema',
      message: () =>
        pass
          ? 'Expected the body not to match the schema, but it does.'
          : `The body does not match the schema:\n  ${errors.join('\n  ')}`,
    };
  },
});
