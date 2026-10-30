import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base.client';

/**
 * Base for Store API (/store/*) clients: every request carries the publishable API key.
 * Pass `null` to send requests without the key (negative tests).
 */
export abstract class StoreClient extends BaseApiClient {
  constructor(
    request: APIRequestContext,
    private readonly publishableApiKey: string | null,
  ) {
    super(request);
  }

  protected defaultHeaders(): Record<string, string> {
    return this.publishableApiKey ? { 'x-publishable-api-key': this.publishableApiKey } : {};
  }
}
