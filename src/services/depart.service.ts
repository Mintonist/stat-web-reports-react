import { IDepart } from '../models';
import httpService from './http.service';
import { config } from '../config';
import api from '../api/index.js';

const departEndpoint = config.API_URL + 'depart/';

const departService = {
  update: async (id, content) => {
    const data = { content: null };
    data.content = (await api.departs.update(id, content)) as IDepart;
    //const { data } = await httpService.put(userEndpoint + id, content);
    return data;
  },
  get: async (id) => {
    const data = { content: null };
    data.content = (await api.departs.getById(id)) as IDepart;
    // const { data } = await httpService.get(userEndpoint + id);
    return data;
  },
  add: async (content) => {
    const data = { content: null };
    data.content = (await api.departs.add(content)) as IDepart;
    //const { data } = await httpService.post(userEndpoint, content);
    return data;
  },
  delete: async (id) => {
    const data = { content: null };
    data.content = (await api.departs.remove(id)) as IDepart;
    //const { data } = await httpService.delete(userEndpoint, id);

    return data;
  },
  fetchAll: async () => {
    const data = { content: null };
    data.content = (await api.departs.fetchAll()) as IDepart[];
    //const { data } = await httpService.get(userEndpoint);
    return data;
  },
};

export default departService;
