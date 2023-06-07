import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IReport } from '../models';
import reportService from '../services/report.service';

interface IReportContext {
  isLoading: boolean;
  reports: IReport[];
  getReport?: (id: string) => IReport;
  filterReports?: (userId: string, includePublic?: boolean, departId?: string) => IReport[];
  updateReport?: (id: string, data: any) => Promise<IReport>;
  addReport?: (data: any) => Promise<IReport>;
  deleteReport?: (id: string) => Promise<IReport>;
}

const ReportsContext = createContext<IReportContext>(null);

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [error, setError] = useState<string>(null);
  const [isLoading, setLoading] = useState(true);
  //const prevState = useRef<IReport[]>(null);

  async function getAll() {
    try {
      const data = await reportService.fetchAll();
      console.log('UsersProvider', data);
      data.content.sort((a, b) => a.name.localeCompare(b.name));
      setReports(data.content);
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

  const getReport = (id) => {
    return reports.find((q) => q._id === id);
  };

  // всегда фильтруем по пользователю (можно включить чужие публичные), и дополнительно к этому можно по отделу
  const filterReports = (userId: string, includePublic: boolean = true, departId: string = null) => {
    let res = reports.filter((obj) => obj.create_user_id === userId || (includePublic && obj.is_public));
    if (departId != null) res = res.filter((a) => a.depart_id == departId || (departId == '0' && !a.depart_id));
    //.filter((a) => !a.depart_id || a.depart_id == '0');
    return res;
  };

  const updateReport = async (id: string, data: any) => {
    try {
      const { content } = await reportService.update(id, data);
      setReports((prevState) =>
        prevState.map((q) => {
          if (q._id === content._id) {
            q = { ...q, ...content };
          }
          return q;
        })
      );
      return content as IReport;
    } catch (err) {
      catchError(err);
    }
  };

  const addReport = async (data) => {
    try {
      const { content } = await reportService.add(data);
      setReports((prevState) => prevState.concat([content]));
      return content as IReport;
    } catch (err) {
      catchError(err);
    }
  };

  const deleteReport = async (id) => {
    // prevState.current = reports;

    try {
      const { content } = await reportService.delete(id);
      setReports((prevState) => {
        return prevState.filter((q) => q._id !== id);
      });
      return content as IReport;
    } catch (err) {
      // setReports(prevState.current);
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
    <ReportsContext.Provider
      value={{ isLoading, reports, getReport, addReport, updateReport, deleteReport, filterReports }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  return useContext(ReportsContext);
};
