export const CONFIG = {
  IS_SERVER: true, // true - используется httpService, false - используется fakeAPI (без общения с сервером)
  IS_FIREBASE: false, // выбор сервера: между API_FIREBASE_URL и API_URL
  API_FIREBASE_URL: 'https://fast-company-69553-default-rtdb.europe-west1.firebasedatabase.app/',
  API_URL: 'http://127.0.0.1:8081/api/',
  SENTRY_DSN: 'https://1ca7eb38490643acb7df141bd460b13f@o4505317309087744.ingest.sentry.io/4505317318656000',
};
