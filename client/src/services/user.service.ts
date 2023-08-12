import { IUser } from './../models';
import httpService from './http.service';
import { config } from '../config';
import api from '../api/index.js';

const userEndpoint = config.API_URL + 'user/';

const userService = {
  update: async (id, content) => {
    const data = { content: null };
    data.content = (await api.users.update(id, content)) as IUser;
    //const { data } = await httpService.put(userEndpoint + id, content);
    return data;
  },
  get: async (id) => {
    const data = { content: null };
    data.content = (await api.users.getById(id)) as IUser;
    // const { data } = await httpService.get(userEndpoint + id);
    return data;
  },
  add: async (content) => {
    const data = { content: null };
    data.content = (await api.users.add(content)) as IUser;
    //const { data } = await httpService.post(userEndpoint, content);
    return data;
  },
  delete: async (id) => {
    const data = { content: null };
    data.content = (await api.users.remove(id)) as IUser;
    //const { data } = await httpService.delete(userEndpoint, id);

    return data;
  },
  fetchAll: async () => {
    const data = { content: null };
    data.content = (await api.users.fetchAll()) as IUser[];
    //const { data } = await httpService.get(userEndpoint);
    return data;
  },
};

export default userService;
