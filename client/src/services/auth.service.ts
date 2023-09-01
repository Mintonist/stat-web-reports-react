import axios from 'axios';
import logService from './log.service';
import { toast } from 'react-toastify';
import localStorageService from './localstorage.service';
import { CONFIG } from '../config.js';
import { generateAuthError } from '../utils/generateAuthError';

// нужно создать отдельный экземпляр axios c настройками и interceptors которые используются здесь, но не мешают использовать "чистый" axios где-то ещё в проекте
export const httpAuth = axios.create({
  baseURL: CONFIG.IS_FIREBASE ? 'https://identitytoolkit.googleapis.com/v1/' : CONFIG.API_URL + 'auth/',
  params: { key: process.env.REACT_APP_FIREBASE_KEY },
});

// глобально отловим ошибки 5xx ("неожидаемые")
httpAuth.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    if (err.response && err.response.status >= 400 && err.response.status < 600) {
      logService.log(err);
      console.log('Unexpected error: ' + err.response);
      toast.error('Ошибка сервера [' + err.response.status + '].\n' + generateAuthError(err.response.data.message));
    }
    return Promise.reject(err);
  }
);

const authService = {
  register: async (payload) => {
    const { data } = await httpAuth.post(CONFIG.IS_FIREBASE ? 'accounts:signUp' : 'signUp', {
      ...payload,
      returnSecureToken: true,
    });
    return data;
  },
  login: async ({ login, password }) => {
    const { data } = await httpAuth.post(CONFIG.IS_FIREBASE ? 'accounts:signInWithPassword' : 'signInWithPassword', {
      login,
      password,
      returnSecureToken: true,
    });
    return data;
  },
  refresh: async () => {
    const { data } = await httpAuth.post('token', {
      grant_type: 'refresh_token',
      refresh_token: localStorageService.getRefreshToken(),
    });
    return data;
  },
};

export default authService;
