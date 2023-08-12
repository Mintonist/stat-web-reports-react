//import * as Sentry from '@sentry/react';
import { init, captureException } from '@sentry/react';
import { config } from '../config';

function init2() {
  init({
    dsn: config.SENTRY_DSN,
    // integrations: [new Integrations.TryCatch()],
    tracesSampleRate: 1.0,
  });
}

init2();

function log(data) {
  console.log('LOG: ', data);
  captureException(data);
}

const logService = { log };
export default logService;
