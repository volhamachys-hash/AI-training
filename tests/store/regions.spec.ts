import { test, expect } from '../../fixtures';
import { StoreRegionsClient } from '../../api/store/regions.client';
import { StoreRegionListResponse, StoreRegionResponse } from '../../api/store/regions.types';
import { ApiError } from '../../api/error.types';
import { storeRegionListSchema, storeRegionResponseSchema } from '../../schemas/store/region.schema';

test.describe('Store API: Regions', () => {
  test('REG-01: list of regions matches the contract', async ({ storeRegions }) => {
    const response = await storeRegions.list();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    const body: StoreRegionListResponse = await response.json();
    expect(body).toMatchSchema(storeRegionListSchema);
    expect(body.regions.length).toBeGreaterThan(0);
    expect(body.count).toBeGreaterThanOrEqual(body.regions.length);
  });

  test('REG-02: region is retrieved by id', async ({ storeRegions }) => {
    // Read-only data of the stand: take an existing id instead of hardcoding it.
    const list: StoreRegionListResponse = await (await storeRegions.list({ limit: 1 })).json();
    const expected = list.regions[0];

    const response = await storeRegions.retrieve(expected.id);

    expect(response.status()).toBe(200);
    const body: StoreRegionResponse = await response.json();
    expect(body).toMatchSchema(storeRegionResponseSchema);
    expect(body.region).toMatchObject({
      id: expected.id,
      name: expected.name,
      currency_code: expected.currency_code,
    });
  });

  test('REG-03: unknown region id returns 404', async ({ storeRegions }) => {
    const response = await storeRegions.retrieve('reg_does_not_exist');

    expect(response.status()).toBe(404);
    const body: ApiError = await response.json();
    expect(body.type).toBe('not_found');
    expect(body.message).toContain('reg_does_not_exist');
  });

  test('REG-04: request without the publishable API key is rejected', async ({ request }) => {
    const withoutKey = new StoreRegionsClient(request, null);

    const response = await withoutKey.list();

    expect(response.status()).toBe(400);
    const body: ApiError = await response.json();
    expect(body.type).toBe('not_allowed');
    expect(body.message).toContain('x-publishable-api-key');
  });
});
