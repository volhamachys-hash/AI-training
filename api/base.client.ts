import { APIRequestContext } from '@playwright/test';

/** Query parameters as Playwright accepts them. */
export type Query = Record<string, string | number | boolean>;

type RequestOptions = {
  params?: Query;
  data?: unknown;
  headers?: Record<string, string>;
};

/**
 * Thin wrapper over Playwright APIRequestContext. Endpoint clients extend it and expose one method
 * per endpoint; the raw APIResponse is returned so the test asserts status, headers and body itself.
 */
export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  /** Headers sent with every request of this client (auth, API keys). */
  protected defaultHeaders(): Record<string, string> {
    return {};
  }

  protected get(path: string, options: RequestOptions = {}) {
    return this.request.get(path, this.withDefaults(options));
  }

  protected post(path: string, options: RequestOptions = {}) {
    return this.request.post(path, this.withDefaults(options));
  }

  protected put(path: string, options: RequestOptions = {}) {
    return this.request.put(path, this.withDefaults(options));
  }

  protected patch(path: string, options: RequestOptions = {}) {
    return this.request.patch(path, this.withDefaults(options));
  }

  protected delete(path: string, options: RequestOptions = {}) {
    return this.request.delete(path, this.withDefaults(options));
  }

  private withDefaults(options: RequestOptions) {
    return { ...options, headers: { ...this.defaultHeaders(), ...options.headers } };
  }
}
