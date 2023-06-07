import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import userService from '../services/user.service';
import { toast } from 'react-toastify';
import { IUser } from '../models';
import logService from '../services/log.service';
import LoadingAnim from '../components/ui/loadingAnim';

interface IUserContext {
  users: IUser[];
  getUser?: (id: string) => IUser;
  updateUser?: (id: string, data: any) => Promise<IUser>;
  addUser?: (data: any) => Promise<IUser>;
  deleteUser?: (id: string) => Promise<IUser>;
}

const UsersContext = createContext<IUserContext>(null);

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [error, setError] = useState<string>(null);
  const [isLoading, setLoading] = useState(true);
  const prevState = useRef<IUser[]>(null);

  async function getUsers() {
    try {
      const data = await userService.fetchAll();
      console.log('UsersProvider', data);
      setUsers(data.content);
      setLoading(false);
    } catch (err) {
      console.log('UsersProvider err', err);
      const { message } = err.response.data;
      setError(message);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const getUser = (id) => {
    return users.find((q) => q._id === id);
  };

  const updateUser = async (id: string, data: any) => {
    try {
      const { content } = await userService.update(id, data);
      setUsers((prevState) =>
        prevState.map((q) => {
          if (q._id === content._id) {
            q = { ...q, ...content };
          }
          return q;
        })
      );
      return content as IUser;
    } catch (err) {
      catchError(err);
    }
  };

  const addUser = async (data) => {
    try {
      const { content } = await userService.add(data);
      setUsers((prevState) => prevState.concat([content]));
      return content as IUser;
    } catch (err) {
      catchError(err);
    }
  };

  const deleteUser = async (id) => {
    prevState.current = users;

    try {
      setUsers((prevState) => {
        return prevState.filter((q) => q._id !== id);
      });
      const { content } = await userService.delete(id);
      return content as IUser;
    } catch (err) {
      console.log(err);
      setUsers(prevState.current);
      catchError(err);
    }
  };

  const catchError = (err) => {
    // const { message, code } = err.response.data;
    // const status = err.response.status;
    // console.log('Expected error: ' + status, code, message);
    setError(String(err));
  };

  useEffect(() => {
    if (error) {
      logService.log(error);
      toast.error(error);
    }
    setError(null);
  }, [error]);

  return (
    <UsersContext.Provider value={{ users, getUser, updateUser, addUser, deleteUser }}>
      {!isLoading ? children : <LoadingAnim />}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  return useContext(UsersContext);
};
