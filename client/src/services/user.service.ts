import { IUser } from './../models';
import httpService from './http.service';
import { CONFIG } from '../config';
import api from '../api/index.js';

const endpoint = (CONFIG.IS_FIREBASE ? CONFIG.API_FIREBASE_URL : CONFIG.API_URL) + 'user/';

const userService = {
  update: async (id, content) => {
    if (CONFIG.IS_SERVER) {
      const { data } = await httpService.put(endpoint + id, content);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.users.update(id, content)) as IUser;
      //const { data } = await httpService.put(userEndpoint + id, content);
      return data;
    }
  },
  get: async (id) => {
    if (CONFIG.IS_SERVER) {
      const { data } = await await httpService.get(endpoint + id);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.users.getById(id)) as IUser;
      // const { data } = await httpService.get(userEndpoint + id);
      return data;
    }
  },
  add: async (content) => {
    if (CONFIG.IS_SERVER) {
      const { data } = await httpService.post(endpoint, content);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.users.add(content)) as IUser;
      //const { data } = await httpService.post(userEndpoint, content);
      return data;
    }
  },
  delete: async (id) => {
    if (CONFIG.IS_SERVER) {
      const { data } = await httpService.delete(endpoint + id);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.users.remove(id)) as IUser;
      //const { data } = await httpService.delete(userEndpoint, id);
      return data;
    }
  },
  fetchAll: async () => {
    if (CONFIG.IS_SERVER) {
      const { data } = await httpService.get(endpoint);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.users.fetchAll()) as IUser[];
      //const { data } = await httpService.get(userEndpoint);
      return data;
    }
  },
};

export default userService;
