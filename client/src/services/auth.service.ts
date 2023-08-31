import axios from 'axios';
import localStorageService from './localstorage.service';
import { CONFIG } from '../config.js';

// нужно создать отдельный экземпляр axios c настройками и interceptors которые используются здесь, но не мешают использовать "чистый" axios где-то ещё в проекте
export const httpAuth = axios.create({
  baseURL: CONFIG.IS_FIREBASE ? 'https://identitytoolkit.googleapis.com/v1/' : CONFIG.API_URL + 'auth/',
  params: { key: process.env.REACT_APP_FIREBASE_KEY },
});

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
