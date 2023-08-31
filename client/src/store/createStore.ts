import { configureStore, combineReducers } from '@reduxjs/toolkit';
import departsReducer from './departs';
import reportsReducer from './reports';
import usersReducer from './users';

const rootReducer = combineReducers({
  reports: reportsReducer,
  departs: departsReducer,
  users: usersReducer,
});

function createStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export default createStore;
