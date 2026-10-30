/**
 * Store API: Regions. Source: Medusa v2 Store OpenAPI (StoreRegion, BaseRegionCountry, GET /store/regions).
 * Required fields follow the spec, not a sample response. additionalProperties stays open: fields the
 * spec does not list (deleted_at, region_id, ...) are not a contract violation.
 */

const storeRegionCountrySchema = {
  type: 'object',
  // Spec vs stand: the spec requires `id`, but the stand returns countries without `id`, keyed by
  // iso_2 (checked on every country of the stand). The schema follows the verified key; the
  // discrepancy belongs in the Gaps of the task, not silently in either direction.
  required: ['iso_2'],
  properties: {
    iso_2: { type: 'string' },
    iso_3: { type: 'string' },
    num_code: { type: 'string' },
    name: { type: 'string' },
    display_name: { type: 'string' },
  },
};

export const storeRegionSchema = {
  type: 'object',
  required: ['id', 'name', 'currency_code'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    currency_code: { type: 'string' },
    automatic_taxes: { type: 'boolean' },
    countries: { type: 'array', items: storeRegionCountrySchema },
    payment_providers: { type: 'array' },
    // Spec vs stand: the spec types metadata as object, the stand returns null when it is empty.
    metadata: { type: ['object', 'null'] },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
};

/** 200 of GET /store/regions */
export const storeRegionListSchema = {
  type: 'object',
  required: ['regions', 'count', 'offset', 'limit'],
  properties: {
    regions: { type: 'array', items: storeRegionSchema },
    count: { type: 'number' },
    offset: { type: 'number' },
    limit: { type: 'number' },
  },
};

/** 200 of GET /store/regions/{id} */
export const storeRegionResponseSchema = {
  type: 'object',
  required: ['region'],
  properties: {
    region: storeRegionSchema,
  },
};
