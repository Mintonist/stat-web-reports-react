//import * as Sentry from '@sentry/react';
// import { init, captureException } from '@sentry/react';
// import { CONFIG } from '../config';

function init2() {
  // init({
  //   dsn: CONFIG.SENTRY_DSN,
  //   // integrations: [new Integrations.TryCatch()],
  //   tracesSampleRate: 1.0,
  // });
}

init2();

function log(data) {
  console.log('LOG: ', data);
  // captureException(data);
}

const logService = { log };
export default logService;
