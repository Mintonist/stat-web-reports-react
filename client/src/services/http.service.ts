import authService from './auth.service';
import axios from 'axios';
import logService from './log.service';
import { toast } from 'react-toastify';
import { CONFIG } from '../config';
//import { httpAuth } from '../hooks/useAuth';
import localStorageService from './localstorage.service';

// нужно создать отдельный экземпляр axios c настройками и interceptors которые используются здесь, но не мешают использовать "чистый" axios где-то ещё в проекте
const myAxios = axios.create();

myAxios.interceptors.request.use(
  async function (config) {
    //console.log('config.url', config.url);
    const expireDate = localStorageService.getExpiresDate();
    const refreshToken = localStorageService.getRefreshToken();
    const isExpire = refreshToken && expireDate < Date.now();

    // подмена url для firebase
    if (CONFIG.IS_FIREBASE) {
      const containEndSlash = /\/$/gi.test(config.url);
      if (containEndSlash) {
        config.url = config.url.slice(0, -1);
      }
      const containEndJson = /.json$/gi.test(config.url);
      if (!containEndJson) {
        config.url = config.url + '.json';
      }

      if (isExpire) {
        const data = await authService.refresh();

        localStorageService.setTokens({
          refreshToken: data.refresh_token,
          idToken: data.id_token,
          experiesIn: data.expires_in,
          localId: data.user_id,
        });
      }

      const accessToken = localStorageService.getAccessToken();
      if (accessToken) {
        config.params = { ...config.params, auth: accessToken };
      }
    } else {
      if (isExpire) {
        //console.log('myAxios.interceptors.request.use');
        const data = await authService.refresh();
        console.log('myAxios.interceptors.request.use', data);
        localStorageService.setTokens({
          refreshToken: data.refreshToken,
          idToken: data.accessToken,
          experiesIn: data.experiesIn,
          localId: data.userId,
        });
      }

      const accessToken = localStorageService.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = 'Bearer ' + accessToken;
      }
    }
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

function transformData(data) {
  return data && !data._id ? Object.keys(data).map((key) => ({ ...data[key] })) : data;
}

// глобально отловим ошибки 5xx ("неожидаемые")
myAxios.interceptors.response.use(
  (res) => {
    if (CONFIG.IS_FIREBASE) {
      res.data = { content: transformData(res.data) };
    } else {
      res.data = { content: res.data };
    }
    return res;
  },
  (err) => {
    if (err.response && err.response.status >= 500 && err.response.status < 600) {
      logService.log(err);
      console.log('Unexpected error: ' + err.response.status);
      toast.error('Ошибка сервера. Попробуйте позже.');
    }
    return Promise.reject(err);
  }
);

const httpService = { get: myAxios.get, post: myAxios.post, put: myAxios.patch, delete: myAxios.delete };
export default httpService;
