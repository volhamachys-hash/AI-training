import { Query } from '../base.client';
import { StoreClient } from './store.client';

/** Store API: Regions. https://docs.medusajs.com/api/store#regions */
export class StoreRegionsClient extends StoreClient {
  /** GET /store/regions: query supports limit, offset, order, fields, q, id, currency_code. */
  list(params?: Query) {
    return this.get('/store/regions', { params });
  }

  /** GET /store/regions/{id} */
  retrieve(id: string, params?: Query) {
    return this.get(`/store/regions/${id}`, { params });
  }
}
