import React, { createContext, useContext, useEffect, useState } from 'react';
import userService from '../services/user.service';
import localStorageService from '../services/localstorage.service';
import { toast } from 'react-toastify';
import { IUser } from '../models';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

interface IAuthContext {
  user?: IUser;
  login?: (any) => any;
  logout?: () => any;
  signUp?: (any) => any;
  updateUser?: (id: string, data: any) => Promise<IUser>;
}

// нужно создать отдельный экземпляр axios c настройками и interceptors которые используются здесь, но не мешают использовать "чистый" axios где-то ещё в проекте
export const httpAuth = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1/',
  params: { key: process.env.REACT_APP_FIREBASE_KEY },
});

const AuthContext = createContext<IAuthContext>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<IUser>(null);
  const [error, setError] = useState<string>(null);
  const [isLoading, setLoading] = useState(true);

  console.log('AuthProvider render');

  const history = useHistory();

  async function logout() {
    localStorageService.clearTokens();
    setUser(null);
    history.push('/');
  }

  async function login({ email, password }) {
    try {
      //const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`;
      const { data } = await httpAuth.post('accounts:signInWithPassword', { email, password, returnSecureToken: true });

      localStorageService.setTokens(data);
      await getUserData();
    } catch (err) {
      const { code, message } = err.response.data.error;

      if (code === 400) {
        if (message === 'EMAIL_NOT_FOUND') {
          const e = { email: 'Email не найден' };

          throw e;
        }
        if (message === 'INVALID_PASSWORD') {
          const e = { password: 'Пароль недействителен' };

          throw e;
        }
        if (message === 'USER_DISABLED') {
          const e = { email: 'Учетная запись пользователя отключена' };

          throw e;
        } else {
          catchError(err);
        }
      } else {
        catchError(err);
      }
    }
  }
  function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async function signUp({ email, password, ...rest }) {
    try {
      //const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`;
      const { data } = await httpAuth.post('accounts:signUp', { email, password, returnSecureToken: true });

      localStorageService.setTokens(data);
      await createUser({
        _id: data.localId,
        email,
        rate: randomInt(0, 10),
        completedMeetings: randomInt(0, 100),
        ...rest,
      });
    } catch (err) {
      const { code, message } = err.response.data.error;

      if (code === 400) {
        if (message === 'EMAIL_EXISTS') {
          const e = { email: 'Email занят' };

          throw e;
        } else {
          catchError(err);
        }
      } else {
        catchError(err);
      }
    }
  }

  async function createUser(data) {
    try {
      const { content } = await userService.add(data);
      console.log(content);
      setUser(content);
      return content as IUser;
    } catch (err) {
      catchError(err);
    }
  }

  const updateUser = async (id: string, data: any) => {
    try {
      const { content } = await userService.update(id, data);
      setUser(content);
      return content as IUser;
    } catch (err) {
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
      console.log('toast.error()', error);
      toast.error(error);
    }
    setError(null);
  }, [error]);

  async function getUserData() {
    try {
      const { content } = await userService.get(localStorageService.getUserId());
      setUser(content);
    } catch (err) {
      catchError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorageService.getUserId()) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, updateUser }}>
      {!isLoading ? children : 'Loading...'}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
