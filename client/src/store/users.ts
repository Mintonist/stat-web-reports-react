import { createAction, createSlice } from '@reduxjs/toolkit';
import { CONFIG } from '../config';
import authService from '../services/auth.service';
import localStorageService from '../services/localstorage.service';
import userService from '../services/user.service';
import { generateAuthError } from '../utils/generateAuthError';

const initialState = {
  entities: [],
  isLoading: true,
  error: null,
  auth: localStorageService.getAccessToken() ? { userId: localStorageService.getUserId() } : null,
  isLoggedIn: localStorageService.getAccessToken() ? true : false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    recived(state, action) {
      //console.log('usersSlice', action);
      state.entities = action.payload;
      state.isLoading = false;
    },
    usersRequested(state) {
      state.isLoading = true;
    },
    usersRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    authRequested(state) {
      state.error = null;
    },
    authRequestFailed(state, action) {
      state.error = action.payload;
      state.isLoggedIn = false;
    },
    authRequestSuccess(state, action) {
      state.auth = { ...action.payload };
      state.isLoggedIn = true;
    },
    userLogout(state) {
      state.entities = [];
      state.isLoggedIn = false;
      state.auth = null;
      state.isLoading = true;
    },
    userCreated(state, action) {
      state.entities.push(action.payload);
    },
    userUpdated(state, action) {
      console.log('userUpdated', action.payload);
      state.entities = state.entities.map((u) => {
        if (u._id === action.payload._id) {
          console.log('userUpdated', u._id);
          u = { ...u, ...action.payload };
        }
        return u;
      });
    },
    userDeleted(state, action) {
      console.log('userDeleted', action.payload);
      state.entities = state.entities.filter((u) => {
        return u._id !== action.payload._id;
      });
    },
  },
});

const { actions, reducer: usersReducer } = usersSlice;

const {
  recived,
  userCreated,
  userUpdated,
  userDeleted,
  authRequested,
  userLogout,
  usersRequested,
  usersRequestFailed,
  authRequestSuccess,
  authRequestFailed,
} = actions;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// просто actions без обработки и payload в отличие от reducers в createSlice выше
const userCreateRequested = createAction('users/userCreateRequested');
const userCreateFailed = createAction('users/userCreateFailed');
const userUpdateRequested = createAction('users/userUpdateRequested');
const userUpdateFailed = createAction('users/userUpdateFailed');
const userDeleteRequested = createAction('users/userDeleteRequested');
const userDeleteFailed = createAction('users/userDeleteFailed');

export const createUser = (data) => async (dispatch) => {
  try {
    dispatch(userCreateRequested());
    const { content } = await userService.add(data);
    dispatch(userCreated(content));
  } catch (err) {
    dispatch(userCreateFailed());
  }
};

export const updateUser = (id: string, data: any) => async (dispatch) => {
  try {
    dispatch(userUpdateRequested());

    const { content } = await userService.update(id, data);
    dispatch(userUpdated(content));
  } catch (error) {
    dispatch(userUpdateFailed(error.message));
  }
};

export const deleteUser = (id: string) => async (dispatch) => {
  try {
    dispatch(userDeleteRequested());
    const { content } = await userService.delete(id);
    dispatch(userDeleted(content));
  } catch (error) {
    dispatch(userDeleteFailed(error.message));
  }
};

export const login =
  ({ login, password }) =>
  async (dispatch) => {
    dispatch(authRequested());
    try {
      const data = await authService.login({ login, password });

      if (CONFIG.IS_FIREBASE) {
        console.log('users.login', data);
        localStorageService.setTokens({
          refreshToken: data.refresh_token,
          idToken: data.id_token,
          experiesIn: data.expires_in,
          localId: data.user_id,
        });
        //localStorageService.setTokens(data);

        dispatch(authRequestSuccess({ userId: data.localId }));
      } else {
        console.log('users.login', data);
        localStorageService.setTokens({
          refreshToken: data.refreshToken,
          idToken: data.accessToken,
          experiesIn: data.experiesIn,
          localId: data.userId,
        });
        //localStorageService.setTokens(data);

        dispatch(authRequestSuccess({ userId: data.userId }));
        //history.push('/users');
      }
    } catch (error) {
      dispatch(authRequestFailed(error.message));
      // const { code, message } = error.response.data.error;
      // if (code === 400) {
      //   const errorMessage = generateAuthError(message);
      //   dispatch(authRequestFailed(errorMessage));
      // } else {
      //   dispatch(authRequestFailed(error.message));
      // }
    }
  };

export const logout = () => async (dispatch) => {
  localStorageService.clearTokens();

  dispatch(userLogout());
  // setUser(null);
  // const history = useHistory();
  // history.push('/');
};

export const signUp =
  ({ email, password, ...rest }) =>
  async (dispatch) => {
    dispatch(authRequested());
    try {
      const data = await authService.register({ email, password, ...rest });

      if (CONFIG.IS_FIREBASE) {
        console.log('users.signUp', data);
        localStorageService.setTokens({
          refreshToken: data.refresh_token,
          idToken: data.id_token,
          experiesIn: data.expires_in,
          localId: data.user_id,
        });
        //localStorageService.setTokens(data);

        dispatch(authRequestSuccess({ userId: data.localId }));

        dispatch(
          createUser({
            _id: data.localId,
            email,
            rate: randomInt(0, 10),
            completedMeetings: randomInt(0, 100),
            ...rest,
          })
        );
      } else {
        console.log('users.signUp', data);
        localStorageService.setTokens({
          refreshToken: data.refreshToken,
          idToken: data.accessToken,
          experiesIn: data.experiesIn,
          localId: data.userId,
        });
        //localStorageService.setTokens(data);

        dispatch(authRequestSuccess({ userId: data.userId }));
        //history.push('/users');
      }
    } catch (error) {
      dispatch(authRequestFailed(error.message));
    }
  };

export const loadUsersList = () => async (dispatch, getState) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.fetchAll();
    dispatch(recived(content));
  } catch (error) {
    dispatch(usersRequestFailed(error.message));
  }
};

export const getUsers = () => (state) => state.users.entities;
export const getUsersLastFetch = () => (state) => state.users.lastFetch;
export const getUserById = (id) => (state) => state.users.entities.find((el) => el._id === id);
export const getUsersLoadingStatus = () => (state) => state.users.isLoading;

export const getIsLoggedIn = () => (state) => state.users.isLoggedIn;
export const getCurrentUserId = () => (state) => state.users.auth.userId;
export const getCurrentUserInfo = () => (state) => {
  if (!state.users.entities) return null;
  return state.users.entities.find((u) => u._id == state.users.auth.userId);
};

export const isCurrentUserAdmin = () => (state) => {
  if (!state.users.entities) return false;
  const u = state.users.entities.find((u) => u._id == state.users.auth.userId);
  return u && u.role == 'admin';
};

export const getAuthError = () => (state) => state.users.error;

export default usersReducer;
