import { IReport } from '../models';
import httpService from './http.service';
import { config } from '../config';
import api from '../api/index.js';

const reportEndpoint = config.API_URL + 'report/';

const reportService = {
  update: async (id, content) => {
    const data = { content: null };
    data.content = (await api.reports.update(id, content)) as IReport;
    //const { data } = await httpService.put(userEndpoint + id, content);
    return data;
  },
  get: async (id) => {
    const data = { content: null };
    data.content = (await api.reports.getById(id)) as IReport;
    // const { data } = await httpService.get(userEndpoint + id);
    return data;
  },
  add: async (content) => {
    const data = { content: null };
    data.content = (await api.reports.add(content)) as IReport;
    //const { data } = await httpService.post(userEndpoint, content);
    return data;
  },
  delete: async (id) => {
    const data = { content: null };
    data.content = (await api.reports.remove(id)) as IReport;
    //const { data } = await httpService.delete(userEndpoint, id);

    return data;
  },
  fetchAll: async () => {
    const data = { content: null };
    data.content = (await api.reports.fetchAll()) as IReport[];
    //const { data } = await httpService.get(userEndpoint);
    return data;
  },
};

export default reportService;
