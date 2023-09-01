import { IReport } from '../models';
import httpService from './http.service';
import { CONFIG } from '../config';
import api from '../api/index.js';

const endpoint = (CONFIG.IS_FIREBASE ? CONFIG.API_FIREBASE_URL : CONFIG.API_URL) + 'report/';

const reportService = {
  update: async (id, content) => {
    if (CONFIG.IS_SERVER) {
      const { data } = await httpService.put(endpoint + id, content);
      return data;
    } else {
      const data = { content: null };
      data.content = (await api.reports.update(id, content)) as IReport;
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
      data.content = (await api.reports.getById(id)) as IReport;
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
      data.content = (await api.reports.add(content)) as IReport;
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
      data.content = (await api.reports.remove(id)) as IReport;
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
      data.content = (await api.reports.fetchAll()) as IReport[];
      //const { data } = await httpService.get(userEndpoint);
      return data;
    }
  },
};

export default reportService;
