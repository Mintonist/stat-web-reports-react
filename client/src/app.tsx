import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './components/ui/navBar';
import Depart from './layouts/depart';
import Departs from './layouts/departsList';
import Login from './layouts/login';

import Main from './layouts/main';
import NotFound from './layouts/notFound';
import Profile from './layouts/profile';
import Report from './layouts/report';
import Users from './layouts/usersList';
import { IUser } from './models';
//import userStore from './store/userMobx';
import { ISortConfig } from './utils/sorter';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { UsersProvider } from './hooks/useUsers';
//import { DepartsProvider } from './hooks/useDeparts';
//import { ReportsProvider } from './hooks/useReports';
import { useSelector } from 'react-redux';
import { getIsLoggedIn } from './store/users';
import AppLoader from './components/ui/hoc/appLoader';

export const reportSortConfig: ISortConfig[] = [
  { label: 'По алфавиту', asc: true, sortProperty: 'name' },
  { label: 'По рейтингу', asc: false, sortProperty: 'rate' },
  { label: 'По дате', asc: false, sortProperty: 'change_ts' },
];

const App = () => {
  // const updateUserFromLocalStorage = () => {
  //   // излекаем данные пользователя
  //   const str = localStorage.getItem('user');
  //   const user: IUser = str ? JSON.parse(str) : null;
  //   userStore.setUser(user);
  // };

  // updateUserFromLocalStorage();

  const isLoggedIn = useSelector(getIsLoggedIn());

  // обёртка для Route
  const NavRoute = ({ exact, path, component: Component }) => (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <>
          <div className="vh-100 d-flex flex-column justify-content-start ">
            <NavBar />
            {/* делам обрамление с макс.шириной на всю высоту экрана */}
            <div className="app-data p-3 w-100 shadow flex-grow-1">
              <Component {...props} />
            </div>
          </div>
        </>
      )}
    />
  );

  //console.log('userStore.user', userStore.user);
  return (
    <>
      {/* <AppLoader> */}
      {!isLoggedIn && (
        <Switch>
          <Route path="/" component={Login} />
          <Redirect to="/" />
        </Switch>
      )}
      {isLoggedIn && (
        <AppLoader>
          <Switch>
            {/* <UsersProvider> */}
            {/* <DepartsProvider> */}
            {/* <ReportsProvider> */}
            <Route exact path="/report/:id?" component={Report} />
            <NavRoute exact path="/users" component={Users} />
            <NavRoute exact path="/profile/:id?" component={Profile} />
            <NavRoute exact path="/departs" component={Departs} />
            <NavRoute exact path="/depart/:id?" component={Depart} />
            <NavRoute exact path="/main" component={Main} />
            <NavRoute exact path="/404" component={NotFound} />
            <Redirect exact from="/" to="/main" />
            {/* </ReportsProvider> */}
            {/* </DepartsProvider> */}
            {/* </UsersProvider> */}

            <Redirect to="/404" />
          </Switch>
        </AppLoader>
      )}
      {/* <button
        className="btn"
        onClick={() => {
          const data = null;
          console.log(data.info);
        }}
      >
        Break the world
      </button> */}

      <ToastContainer autoClose={5000} closeButton={true} position={'top-center'} />
      {/* </AppLoader> */}
    </>
  );
};

export default App;
