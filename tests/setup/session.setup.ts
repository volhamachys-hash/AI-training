import { test as setup } from '@playwright/test';
import { SESSION_STORAGE_STATE } from '../../config/env';
import { openSession } from '../../helpers/session.helper';

setup('open stand session', async ({ request }) => {
  await openSession(request);
  await request.storageState({ path: SESSION_STORAGE_STATE });
});
