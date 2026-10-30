/** Response shapes of the Regions endpoints, as far as the tests rely on them. */

export interface StoreRegionCountry {
  iso_2: string;
  iso_3?: string;
  num_code?: string;
  name?: string;
  display_name?: string;
}

export interface StoreRegion {
  id: string;
  name: string;
  currency_code: string;
  countries?: StoreRegionCountry[];
  metadata?: Record<string, unknown> | null;
}

export interface StoreRegionListResponse {
  regions: StoreRegion[];
  count: number;
  offset: number;
  limit: number;
}

export interface StoreRegionResponse {
  region: StoreRegion;
}
