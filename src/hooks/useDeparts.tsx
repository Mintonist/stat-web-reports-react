import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IDepart } from '../models';
import departService from '../services/depart.service';

interface IDepartContext {
  isLoading: boolean;
  departs: IDepart[];
  getDepart?: (string) => IDepart;
  updateDepart?: (string, any) => Promise<IDepart>;
  addDepart?: (any) => Promise<IDepart>;
  deleteDepart?: (string) => Promise<IDepart>;
}

const DepartsContext = createContext<IDepartContext>(null);

export const DepartsProvider = ({ children }) => {
  const [departs, setDeparts] = useState<IDepart[]>([]);
  const [error, setError] = useState<string>(null);
  const [isLoading, setLoading] = useState(true);
  //const prevState = useRef<IDepart[]>(null);

  async function getAll() {
    try {
      const data = await departService.fetchAll();
      console.log('UsersProvider', data);
      data.content.sort((a, b) => a.code.localeCompare(b.code));
      setDeparts(data.content);
      setLoading(false);
    } catch (err) {
      console.log('UsersProvider err', err);
      const { message } = err.response.data;
      setError(message);
    }
  }

  useEffect(() => {
    getAll();
  }, []);

  const getDepart = (id) => {
    return departs.find((q) => q._id === id);
  };

  const updateDepart = async (id: string, data: any) => {
    try {
      const { content } = await departService.update(id, data);
      setDeparts((prevState) =>
        prevState.map((q) => {
          if (q._id === content._id) {
            q = { ...q, ...content };
          }
          return q;
        })
      );
      return content as IDepart;
    } catch (err) {
      catchError(err);
    }
  };

  const addDepart = async (data) => {
    try {
      const { content } = await departService.add(data);
      setDeparts((prevState) => prevState.concat([content]));
      return content as IDepart;
    } catch (err) {
      catchError(err);
    }
  };

  const deleteDepart = async (id) => {
    // prevState.current = departs;

    try {
      const { content } = await departService.delete(id);
      setDeparts((prevState) => {
        return prevState.filter((q) => q._id !== id);
      });
      return content as IDepart;
    } catch (err) {
      // setDeparts(prevState.current);
      catchError(err);
    }
  };

  const catchError = (err) => {
    const { message, code } = err.response.data;
    const status = err.response.status;
    setError(message);
    console.log('Expected error: ' + status, code, message);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    setError(null);
  }, [error]);

  return (
    <DepartsContext.Provider value={{ isLoading, departs, getDepart, addDepart, updateDepart, deleteDepart }}>
      {children}
    </DepartsContext.Provider>
  );
};

export const useDeparts = () => {
  return useContext(DepartsContext);
};
