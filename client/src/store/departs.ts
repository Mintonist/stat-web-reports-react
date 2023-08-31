import { createAction, createSlice } from '@reduxjs/toolkit';
import departService from '../services/depart.service';

const initialState = { entities: [], isLoading: true, error: null, lastFetch: 0 };

const departsSlice = createSlice({
  name: 'departs',
  initialState,
  reducers: {
    recived(state, action) {
      //console.log('departsSlice', action);
      state.entities = action.payload;
      state.lastFetch = Date.now();
      state.isLoading = false;
    },
    departsRequested(state) {
      state.isLoading = true;
    },
    departsRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    departCreated(state, action) {
      state.entities.push(action.payload);
    },
    departUpdated(state, action) {
      console.log('departUpdated', action.payload);
      state.entities = state.entities.map((u) => {
        if (u._id === action.payload._id) {
          console.log('departUpdated', u._id);
          u = { ...u, ...action.payload };
        }
        return u;
      });
    },
    departDeleted(state, action) {
      console.log('departDeleted', action.payload);
      state.entities = state.entities.filter((u) => {
        return u._id !== action.payload._id;
      });
    },
  },
});

const { actions, reducer: departsReducer } = departsSlice;

const { recived, departCreated, departUpdated, departDeleted, departsRequested, departsRequestFailed } = actions;

// просто actions без обработки и payload в отличие от reducers в createSlice выше
const departCreateRequested = createAction('departs/departCreateRequested');
const departCreateFailed = createAction('departs/departCreateFailed');
const departUpdateRequested = createAction('departs/departUpdateRequested');
const departUpdateFailed = createAction('departs/departUpdateFailed');
const departDeleteRequested = createAction('departs/departDeleteRequested');
const departDeleteFailed = createAction('departs/departDeleteFailed');

export const createDepart = (data) => async (dispatch) => {
  try {
    dispatch(departCreateRequested());
    const { content } = await departService.add(data);
    dispatch(departCreated(content));
  } catch (err) {
    dispatch(departCreateFailed());
  }
};

export const updateDepart = (id: string, data: any) => async (dispatch) => {
  try {
    dispatch(departUpdateRequested());
    const { content } = await departService.update(id, data);
    dispatch(departUpdated(content));
  } catch (error) {
    dispatch(departUpdateFailed(error.message));
  }
};

export const deleteDepart = (id: string) => async (dispatch) => {
  try {
    dispatch(departDeleteRequested());
    const { content } = await departService.delete(id);
    dispatch(departDeleted(content));
  } catch (error) {
    dispatch(departDeleteFailed(error.message));
  }
};

function isOutDated(date) {
  return Date.now() - date > 10 * 60 * 1000;
}

export const loadDepartsList = () => async (dispatch, getState) => {
  if (isOutDated(getState().departs.lastFetch)) {
    dispatch(departsRequested());
    try {
      const { content } = await departService.fetchAll();
      dispatch(recived(content));
    } catch (error) {
      dispatch(departsRequestFailed(error.message));
    }
  }
};

export const getDeparts = () => (state) => state.departs.entities;
export const getDepartsLastFetch = () => (state) => state.departs.lastFetch;
export const getDepartById = (id) => (state) => state.departs.entities.find((el) => el._id === id);
export const getDepartsLoadingStatus = () => (state) => state.departs.isLoading;

export default departsReducer;
