import { createAction, createSlice } from '@reduxjs/toolkit';
import reportService from '../services/report.service';

const initialState = { entities: [], isLoading: true, error: null, lastFetch: 0 };

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    recived(state, action) {
      //console.log('reportsSlice.recived');
      state.entities = action.payload;
      state.lastFetch = Date.now();
      state.isLoading = false;
    },
    reportsRequested(state) {
      // console.log('reportsSlice.reportsRequested');
      state.lastFetch = Date.now();
      state.isLoading = true;
    },
    reportsRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    reportCreated(state, action) {
      state.entities.push(action.payload);
    },
    reportUpdated(state, action) {
      console.log('reportUpdated', action.payload);
      state.entities = state.entities.map((u) => {
        if (u._id === action.payload._id) {
          console.log('reportUpdated', u._id);
          u = { ...u, ...action.payload };
        }
        return u;
      });
    },
    reportDeleted(state, action) {
      console.log('reportDeleted', action.payload);
      state.entities = state.entities.filter((u) => {
        return u._id !== action.payload._id;
      });
    },
  },
});

const { actions, reducer: reportsReducer } = reportsSlice;

const { recived, reportCreated, reportUpdated, reportDeleted, reportsRequested, reportsRequestFailed } = actions;

// просто actions без обработки и payload в отличие от reducers в createSlice выше
const reportCreateRequested = createAction('reports/reportCreateRequested');
const reportCreateFailed = createAction('reports/reportCreateFailed');
const reportUpdateRequested = createAction('reports/reportUpdateRequested');
const reportUpdateFailed = createAction('reports/reportUpdateFailed');
const reportDeleteRequested = createAction('reports/reportDeleteRequested');
const reportDeleteFailed = createAction('reports/reportDeleteFailed');

export const createReport = (data) => async (dispatch) => {
  try {
    dispatch(reportCreateRequested());
    const { content } = await reportService.add(data);
    dispatch(reportCreated(content));
  } catch (err) {
    dispatch(reportCreateFailed());
  }
};

export const updateReport = (id: string, data: any) => async (dispatch) => {
  try {
    dispatch(reportUpdateRequested());
    const { content } = await reportService.update(id, data);
    dispatch(reportUpdated(content));
  } catch (error) {
    dispatch(reportUpdateFailed(error.message));
  }
};

export const deleteReport = (id: string) => async (dispatch) => {
  try {
    dispatch(reportDeleteRequested());
    const { content } = await reportService.delete(id);
    dispatch(reportDeleted(content));
  } catch (error) {
    dispatch(reportDeleteFailed(error.message));
  }
};

function isOutDated(date) {
  return Date.now() - date > 10 * 60 * 1000;
}

export const loadReportsList = () => async (dispatch, getState) => {
  if (isOutDated(getState().reports.lastFetch)) {
    dispatch(reportsRequested());
    try {
      const { content } = await reportService.fetchAll();
      dispatch(recived(content));
    } catch (error) {
      dispatch(reportsRequestFailed(error.message));
    }
  }
};

export const getReports = () => (state) => state.reports.entities;
export const getReportsLastFetch = () => (state) => state.reports.lastFetch;
export const getReportById = (id) => (state) => state.reports.entities.find((el) => el._id === id);
export const getReportsLoadingStatus = () => (state) => state.reports.isLoading;
// всегда фильтруем по пользователю (можно включить чужие публичные), и дополнительно к этому можно по отделу
export const filterReports =
  (userId: string, includePublic: boolean = true, departId: string = null) =>
  (state) => {
    let res = state.reports.entities.filter((obj) => obj.create_user_id === userId || (includePublic && obj.is_public));
    if (departId != null) res = res.filter((a) => a.depart_id == departId || (departId == '0' && !a.depart_id));
    //.filter((a) => !a.depart_id || a.depart_id == '0');
    return res;
  };

export default reportsReducer;
