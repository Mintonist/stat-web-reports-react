import axios from 'axios';
import logService from './log.service';
import { toast } from 'react-toastify';

// глобально отловим ошибки 5xx ("неожидаемые")
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status >= 500 && err.response.status < 600) {
      logService.log(err);
      console.log('Unexpected error: ' + err.response.status);
      toast.error('Ошибка сервера. Попробуйте позже.');
    }
    return Promise.reject(err);
  }
);

const httpService = { get: axios.get, post: axios.post, put: axios.put, delete: axios.delete };
export default httpService;
