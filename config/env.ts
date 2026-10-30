function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  /** Session link of your stand: opening it sets the stand cookie. It is a secret. */
  get sessionUrl() {
    return required('SESSION_URL');
  },
  /** Host of the stand, derived from the session link. Store and Admin API live on it. */
  get baseUrl() {
    const sessionUrl = this.sessionUrl;
    try {
      return new URL(sessionUrl).origin;
    } catch {
      throw new Error('SESSION_URL is not a valid URL. Copy the full link from your task.');
    }
  },
  /** Publishable API key of your stand: required by every Store API (/store/*) request. */
  get publishableApiKey() {
    return required('PUBLISHABLE_API_KEY');
  },
  /** Medusa Admin credentials of your stand. */
  get adminEmail() {
    return required('ADMIN_EMAIL');
  },
  get adminPassword() {
    return required('ADMIN_PASSWORD');
  },
};

/** Stand cookie only: the request context of every API test starts from it. */
export const SESSION_STORAGE_STATE = 'playwright/.auth/session.json';
