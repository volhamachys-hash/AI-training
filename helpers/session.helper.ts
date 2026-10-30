import { APIRequestContext } from '@playwright/test';
import { env } from '../config/env';

/** Opens the session link: the stand answers with a redirect and sets the stand cookie. */
export async function openSession(request: APIRequestContext) {
  const response = await request.get(env.sessionUrl, { maxRedirects: 0 });
  if (response.status() === 403) {
    throw new Error(
      'The stand rejected SESSION_URL (403). The link may be revoked or the stand handed over: take a fresh link from your task.',
    );
  }
  if (response.status() >= 500) {
    throw new Error(
      `The stand does not respond (HTTP ${response.status()}). It may be starting or stopped: wait a minute and rerun, then contact the support of your task.`,
    );
  }
  const { cookies } = await request.storageState();
  if (cookies.length === 0) {
    throw new Error(`The session link set no cookie (HTTP ${response.status()}). Check SESSION_URL in .env.`);
  }
}
