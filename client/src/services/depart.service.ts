import { IDepart } from '../models';
import httpService from './http.service';
import { CONFIG } from '../config';
import api from '../api/index.js';

const endpoint = (CONFIG.IS_FIREBASE ? CONFIG.API_FIREBASE_URL : CONFIG.API_URL) + 'depart/';

const departService = {
  update: async (id, content) => {
    if (CONFIG.IS_SERVER) {
      const { data } = await httpService.put(endpoint + id, content);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.departs.update(id, content)) as IDepart;
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
      data.content = (await api.departs.getById(id)) as IDepart;
      // const { data } = await httpService.get(userEndpoint + id);
      return data;
    }
  },
  add: async (content) => {
    if (CONFIG.IS_SERVER) {
      const { data } = await httpService.put(endpoint + content._id, content);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.departs.add(content)) as IDepart;
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
      data.content = (await api.departs.remove(id)) as IDepart;
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
      data.content = (await api.departs.fetchAll()) as IDepart[];
      //const { data } = await httpService.get(userEndpoint);
      return data;
    }
  },
};

export default departService;
